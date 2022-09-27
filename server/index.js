const express = require('express')
const morgan = require('morgan')
const { createPhoneCheck } = require('./helpers/createPhoneCheck')
const { getPhoneCheck } = require('./helpers/getPhoneCheck')
const { patchPhoneCheck } = require('./helpers/patchPhoneCheck')
const { promisify } = require('util')
const { redisClient } = require('./helpers/redisClient')
const { createSimCheck } = require('./helpers/createSimCheck')
const { createSubscriberCheck } = require('./helpers/createSubscriberCheck')
const { patchSubscriberCheck } = require('./helpers/patchSubscriberCheck')

const app = express()
var get

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
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

// complete PhoneCheck
app.post('/api/exchange-code', async (req, res) => {
  // get the `check_id` from the query parameter
  const { check_id: checkId, code: code } = req.body

  try {
    // get the PhoneCheck response
    const { patchResponseStatus, patchResponse } = await patchPhoneCheck(checkId, code)

    if (patchResponseStatus === 200 && patchResponse.match === true) {
      const users = await get('users')

      if (users) {
        const oldUsers = JSON.parse(users)
        // check if we have a user with that phone number, get it and also filter out the existing user from our array
        // POINT BEING THE USER WANTS TO RE-REGISTER WITH THE SAME PHONE NUMBER
        const existingUser = oldUsers.find((el) => el.phone_number === phone_number)
    
        const updatedUsers = oldUsers.filter(
          (el) => el.phone_number !== phone_number,
        )
    
        // check if we have users, if we do, update the phone number
        if (existingUser) {
          existingUser.phone_number = phone_number
          existingUser.name = ''
          // add the updated user back and set the users to redis
    
          updatedUsers.push(existingUser)
    
          redisClient.setex('users', 60 * 60 * 24 * 7, JSON.stringify(updatedUsers))
          return res.status(200).send({
            data: { match: patchResponse.match, phoneNumber: phone_number, name: '' },
          })
        }

        // we have old users but user has never registered before
        const userProperties = {
          phone_number,
          name: '',
        }

        oldUsers.push(userProperties)

        redisClient.setex('users', 60 * 60 * 24 * 7, JSON.stringify(oldUsers))
      } else {
        const userProperties = {
          phone_number,
          name: '',
        }

        const users = []

        users.push(userProperties)
        redisClient.setex('users', 60 * 60 * 24 * 7, JSON.stringify(users))
      }
    }

    res.status(200).send({ data: { match: patchResponse.match, phoneNumber: phone_number, name: '' } })
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

        console.log('current users for edit / add name are', currentUsers)

        const currentUser = currentUsers.find(
          (el) => el.phone_number === phone_number,
        )

        const otherUsers = currentUsers.filter(
          (el) => el.phone_number !== phone_number,
        )
        // if we have a user with that phone number, update phone number
        if (currentUser) {
          console.log(currentUser.phone_number.trim())

          const { simChanged } = await createSimCheck(
            currentUser.phone_number.trim(),
          )
          //update the users name if SIM has not changed recently and add user back into users array

          if (!simChanged) {
            currentUser.name = name

            otherUsers.push(currentUser)

            redisClient.setex(
              'users',
              60 * 60 * 24 * 7,
              JSON.stringify(otherUsers),
            )

            return res.status(201).send({
              data: { simChanged, name },
              message: 'SIMCheck created',
            })
          }

          return res.status(201).send({
            data: { simChanged, name },
            message: 'SIMCheck created',
          })
        }
      }
    } else if (value === 'phone_number') {
      const { checkId, checkUrl, numberSupported } =
        await createSubscriberCheck(phone_number.trim())

      if (!numberSupported) {
        return res.status(400).send({ message: 'number not supported' })
      } else {
        return res.status(201).send({
          data: { checkId, checkUrl },
          message: 'PhoneCheck created',
        })
      }
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

app.get('/api/edit', async (req, res) => {
  // get the `check_id` from the query parameter
  const { check_id: checkId, old_phone_number, new_phone_number } = req.query

  try {
    // get the SubscriberCheck response
    const { match, simChanged } = await patchSubscriberCheck(checkId, code)

    if (match && !simChanged) {
      const users = await get('users')
      if (users) {
        const currentUsers = JSON.parse(users)

        //update the users phone number
        const updatedUsers = currentUsers.map((el) => {
          if (el.phone_number === old_phone_number) {
            el.phone_number = new_phone_number
          }
          return el
        })

        redisClient.setex(
          'users',
          60 * 60 * 24 * 7,
          JSON.stringify(updatedUsers),
        )
      }

      res
        .status(200)
        .send({ data: { match, simChanged, phoneNumber: new_phone_number } })
    } else {
      res.status(400).send({})
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

// setup server
app.listen(4000, async () => {
  await redisClient.connect()
  get = promisify(redisClient.get).bind(redisClient)

  console.log('listening on PORT 4000')
})
