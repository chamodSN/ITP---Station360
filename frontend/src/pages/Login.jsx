import { useState } from 'react'

const Login = () => {

  const [state, setState ]  = useState('Signup')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    
};

    return (
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-x1 text-zinc-600 text-sm shadow-lg'>
          <p className='text-4x1 font-semibold text-center'>{state === 'Signup' ? "Create Account" : "Login"}</p>
          <p>{state === 'Signup' ? "sign up" : "Login"} to service your vehicle</p>
          {
            state === "Signup" && <div className='w-full'>
              <p>Full name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={name} onChange={(e) => setName(e.target.name)} required />
            </div>
          }

          <div className='w-full'>
            <p>E mail</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' value={email} onChange={(e) => setEmail(e.target.name)} required />
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' value={password} onChange={(e) => setPassword(e.target.name)} required />
          </div>
          <button className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign up' ? "Create Account" : "Login"}</button>
          {
            state === "Signup"
              ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
              : <p>create an new account? <span onClick={() => setState('Signup')} className='text-primary underline cursor-pointer'>click here</span></p>
          }
        </div>
      </form>
    )
  }

  export default Login

