import {config} from '../common/config.js'

export default function Login () {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type='text' placeholder='Username' />
        <input type='password' placeholder='Password' />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
