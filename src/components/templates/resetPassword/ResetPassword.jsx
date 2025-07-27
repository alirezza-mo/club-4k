'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone')

  useEffect(() => {
    if (!phone) router.push('/forgot-password')
  }, [phone])

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirm) return alert('رمزها یکسان نیستند.')

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    })

    setLoading(false)
    if (res.ok) {
      alert('رمز عبور با موفقیت تغییر یافت.')
      router.push('/login')
    } else {
      alert('خطا در تغییر رمز عبور.')
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">رمز جدید</h2>
      <input
        type="password"
        placeholder="رمز جدید"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-4 py-2 w-full"
        required
      />
      <input
        type="password"
        placeholder="تکرار رمز جدید"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="border rounded px-4 py-2 w-full"
        required
      />
      <button type="submit" disabled={loading} className="bg-purple-600 text-white rounded px-4 py-2">
        {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
      </button>
    </form>
  )
}
