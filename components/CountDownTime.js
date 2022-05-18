import { Box, Text } from 'native-base'
import React from 'react'
import { useCountdown } from './useCountDown'

const ExpiredNotice = () => {
  return (
    <Box>
      <Text color={'red.400'}>Book End!</Text>
    </Box>
  )
}
const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <Box>
      <Text color={'green.400'}>{value}</Text>
    </Box>
  )
}

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <>
      <Text color={'gray.400'}>Upcoming in</Text>
      <Box flexDirection="row">
        <DateTimeDisplay value={days} type={''} isDanger={days <= 3} />
        <Text color={'green.400'}>:</Text>
        <DateTimeDisplay value={hours} type={''} isDanger={false} />
        <Text color={'green.400'}>:</Text>
        <DateTimeDisplay value={minutes} type={''} isDanger={false} />
        <Text color={'green.400'}>:</Text>
        <DateTimeDisplay value={seconds} type={''} isDanger={false} />
      </Box>
    </>
  )
}

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />
  } else {
    return <ShowCounter days={days} hours={hours} minutes={minutes} seconds={seconds} />
  }
}

export default CountdownTimer
