import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'

function App() {
  const { data, isPending, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await fetch('/api/');
      return response.json();
    },
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
