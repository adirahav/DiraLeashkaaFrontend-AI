import { useNavigate } from 'react-router-dom'

export function useNativeBackButton() {
  const navigate = useNavigate()

  return () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }
}
