const express = require('express')
const morgan = require('morgan')
const { createPhoneCheck } = require('./helpers/createPhoneCheck')
const { createSimCheck } = require('./helpers/createSimCheck')
const { createSubscriberCheck } = require('./helpers/createSubscriberCheck')
const { getPhoneCheck } = require('./helpers/getPhoneCheckResult')
const { getSubscriberCheck } = require('./helpers/getSubscriberCheck')
const { redisClient } = require('./helpers/redisClient')
const get = promisify(redisClient.get).bind(redisClient)

const app = express()

app.use(express.json())
app.use(morgan('dev'))
// create PhoneCheck
app.post('/api/register', async (req, res) => {
  const { phone_number: phoneNumber } = req.body

  try {
    // create PhoneCheck resource

    const { checkId, checkUrl, numberSupported } = await createPhoneCheck(
      phoneNumber,
    )

    if (!numberSupported) {
      res.status(400).send({ message: 'number not supported' })

      return
    }
    res.status(201).send({
      data: { checkId, checkUrl },
      message: 'PhoneCheck created',
    })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
})

// get PhoneCheck response

app.get('/api/register', async (req, res) => {
  // get the `check_id` from the query parameter
  const { check_id: checkId, phone_number } = req.query

  try {
    // get the PhoneCheck response
    const { match } = await getPhoneCheck(checkId)
    if (match) {
      const users = await get('users')
      // check if there is a mobile token
      if (users) {
        const oldUsers = JSON.parse(users)
        // check if we have a user with that phone number, get it and also filter out the existing user from or array
        // POINT BEING THE USER WANTS TO RE-REGISTER WITH THE SAME PHONE NUMBER
        const existingUser = oldUsers.find(
          (el) => el.phone_number === phone_number,
        )
        const updatedUsers = oldUsers.filter(
          (el) => el.phone_number !== phone_number,
        )
        // check if we have users, if we do, update the fcm_token and device_id
        if (existingUser) {
          existingUser.phone_number = phone_number

          // add the updated user back and set the users to redis

          updatedUsers.push(existingUser)

          return redisClient.setex(
            'users',
            60 * 60 * 24 * 7,
            JSON.stringify(updatedUsers),
          )
        }
        const userProperties = {
          phone_number,
        }
        oldUsers.push(userProperties)

        redisClient.setex('users', 60 * 60 * 24 * 7, JSON.stringify(oldUsers))
      } else {
        const userProperties = {
          phone_number,
        }
        const users = []
        users.push(userProperties)
        redisClient.setex('users', 60 * 60 * 24 * 7, JSON.stringify(users))
      }
    }
    res.status(200).send({ data: { match } })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

app.post('/api/edit', async (req, res) => {
  const { value } = req.query
  const { name, phone_number } = req.body
  try {
    if (value === 'name') {
      const users = await get('users')
      if (users) {
        const currentUsers = JSON.parse(users)

        const currentUser = currentUsers.find((el) => el.name === name)

        const { simChanged } = await createSimCheck(currentUser.phone_number)
        //update the users name
        const updatedUsers = currentUsers.map((el) => {
          if (el.name === name) {
            el.name = name
          }
          return el
        })

        redisClient.setex(
          'users',
          60 * 60 * 24 * 7,
          JSON.stringify(updatedUsers),
        )
        return res
          .status(201)
          .send({ data: simChanged, message: 'PhoneCheck created' })
      }
    } else if (value === 'phone_number') {
      const { checkId, checkUrl } = await createSubscriberCheck(phone_number)
      return res.status(201).send({
        data: { checkId, checkUrl },
        message: 'SubscriberCheck created',
      })
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

app.get('/api/edit', async () => {
  // get the `check_id` from the query parameter
  const { check_id: checkId, phone_number } = req.query

  try {
    // get the SubscriberCheck response
    const { match, simChanged } = await getSubscriberCheck(checkId)

    if (match && !simChanged) {
      const users = await get('users')
      if (users) {
        const currentUsers = JSON.parse(users)

        //update the users phone number
        const updatedUsers = currentUsers.map((el) => {
          if (el.phone_number === phone_number) {
            el.phone_number = phone_number
          }
          return el
        })

        redisClient.setex(
          'users',
          60 * 60 * 24 * 7,
          JSON.stringify(updatedUsers),
        )
      }
    }

    res.status(200).send({ data: { match, simChanged } })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})
// setup server
app.listen(4000, () => {
  console.log('listening on PORT 4000')
})
