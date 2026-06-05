import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminEmail || !adminHash) return null
        if (email.toLowerCase() !== adminEmail.toLowerCase()) return null

        const valid = await bcrypt.compare(password, adminHash)
        if (!valid) return null

        return { id: 'admin', email: adminEmail, name: 'Admin' }
      },
    }),
  ],
  pages: {
    signIn: '/manage/login',
  },
  session: { strategy: 'jwt' },
})
