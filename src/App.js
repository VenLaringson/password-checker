import React, { useState} from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const App = () => {
  const defaultMessage = {
    score: -1,
  }
  const [passwordInput, setPassInput] = useState('')
  const [message, setMessage] = useState(defaultMessage)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")
  const [showPassword, setShowPasword] = useState(false)


  const checkPassword = async (password) => {
      if(password){
        const passwordToCheck = {password}
        setLoading(true)

        const res = await axios.post('https://o9etf82346.execute-api.us-east-1.amazonaws.com/staging/password/strength', passwordToCheck)

        try {
          setMessage(res.data)
        } catch (error) {
          setAlert("Something went wrong. Please Try Again")
        }
        setLoading(false)
      } else {
        setMessage(defaultMessage)
      }
      
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  const handleClickShowPassword = () => {
    setShowPasword(!showPassword)
  }

  const handlePasswordChange = (event) => {
    setPassInput(event.target.value)
    clearTimeout()
    setTimeout(()=>
      checkPassword(event.target.value)
    ,800)

  }

  var barColor, strength

  if(message?.score<2){barColor="error"; strength="too weak!"}
  if(message?.score===2){barColor="warning"; strength="average."}
  if(message?.score===3){barColor="success"; strength="strong."}
  if(message?.score===4){barColor="primary"; strength="very strong!"}

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {alert ? <Alert variant="filled" severity="error" sx={{marginTop:1}}> 
        {alert}
      </Alert> : <></>}
      <Box sx={{marginTop: 8}}
        >
        <Typography component="h1" variant="h5" align="center">Is your password strong enough?</Typography>
        <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type={showPassword?"text":"password"}
            id="password"
            value={passwordInput}
            onChange={handlePasswordChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>)
            }}
          />
        <LinearProgress 
          variant={loading?'indeterminate':"determinate"}
          value={20+message?.score*20} 
          color={loading?"primary":barColor}
          sx={{bgcolor:'grey.200'}}
          />
        {message?.guessTimeString?<Box sx={{display:"flex",flexDirection:"column", gap:"16px"}}>
          <Typography component="h2" variant="h5" align="center">
            Your password is {strength}
            </Typography>

          <Typography component="h4" variant="body2" align="center">
            It would take {message?.guessTimeString} to  guess you password.&nbsp;
            {message?.warning}
            </Typography>

          <Typography component="h3" variant="subtitle1" align="center">
            {message?.suggestions?.map(suggestion=><>{suggestion} </>)}
            </Typography>
        </Box>:<></>}
      </Box>

    </Container>
  )
}

export default App
