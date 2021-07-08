const fetch = require('node-fetch')
const { createAccessToken } = require('./createAccessToken')
exports.createSimCheck = async (phoneNumber) => {
  let numberSupported = true
  const accessToken = await createAccessToken(sim_check)
  const body = JSON.stringify({ phone_number: phoneNumber })
  const response = await fetch(`https://eu.api.tru.id//sim_check/v0.1/checks`, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 201) {
    const data = await response.json()
    console.log(data)

    simChanged = !data.no_sim_changed
  } else if (response.status === 400) {
    console.log('number not supported')
    numberSupported = false
  } else {
    throw new Error(
      `Unexpected API response ${response.status}`,
      response.toString(),
    )
  }
  return { simChanged, numberSupported }
}
