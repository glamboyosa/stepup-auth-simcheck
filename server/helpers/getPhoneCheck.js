const fetch = require('node-fetch')
const { createAccessToken } = require('./createAccessToken')

exports.getPhoneCheck = async (checkId) => {
  const accessToken = await createAccessToken('phone_check')

  const response = await fetch(
    `https://eu.api.tru.id/phone_check/v0.2/checks/${checkId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  console.log('do we have a response')

  const data = await response.json()

  console.log(data)

  return { match: data.match }
}
