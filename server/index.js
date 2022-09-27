const express = require('express')
const morgan = require('morgan')
const { createPhoneCheck } = require('./helpers/createPhoneCheck')
const { getPhoneCheck } = require('./helpers/getPhoneCheck')
const { patchPhoneCheck } = require('./helpers/patchPhoneCheck')

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

    console.log(patchResponseStatus, patchResponse)
    res.status(patchResponseStatus).send({ data: patchResponse })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
})

// setup server
app.listen(4000, () => {
  console.log('listening on PORT 4000')
})
