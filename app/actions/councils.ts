'use server'

import { Resend } from 'resend'

export type CouncilFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation'; errors: Partial<Record<string, string>> }

const resend = new Resend(process.env.RESEND_API_KEY)

function validate(data: Record<string, string>): Partial<Record<string, string>> | null {
  const errors: Partial<Record<string, string>> = {}

  if (!data.name?.trim() || data.name.trim().length < 2)
    errors.name = 'Please enter your full name.'
  if (!data.role?.trim())
    errors.role = 'Please enter your job title or role.'
  if (!data.authority?.trim())
    errors.authority = 'Please enter your local authority name.'
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Please enter a valid email address.'
  if (!data.interest)
    errors.interest = 'Please select what you would like to discuss.'
  if (!data.message?.trim() || data.message.trim().length < 20)
    errors.message = 'Please provide a brief message (at least 20 characters).'

  return Object.keys(errors).length ? errors : null
}

export async function submitCouncilEnquiry(
  _prev: CouncilFormState,
  formData: FormData,
): Promise<CouncilFormState> {
  if (formData.get('_gotcha')) return { status: 'idle' }

  const data = {
    name:      String(formData.get('name')      ?? ''),
    role:      String(formData.get('role')       ?? ''),
    authority: String(formData.get('authority')  ?? ''),
    email:     String(formData.get('email')      ?? ''),
    phone:     String(formData.get('phone')      ?? ''),
    interest:  String(formData.get('interest')   ?? ''),
    message:   String(formData.get('message')    ?? ''),
  }

  const errors = validate(data)
  if (errors) return { status: 'validation', errors }

  try {
    await resend.emails.send({
      from:    'Stredar Enquiries <admin@stredar.uk>',
      to:      'councils@stredar.uk',
      replyTo: data.email,
      subject: `Council Enquiry — ${data.authority} (${data.interest})`,
      html: `
        <div style="font-family:monospace;font-size:14px;color:#14171a;max-width:600px">
          <div style="background:#ff6b1a;padding:16px 24px">
            <span style="font-family:sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:-0.01em">STREDAR</span>
          </div>
          <div style="padding:24px;background:#f5f6f7;border-bottom:3px solid #ff6b1a">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6a717a">Council Enquiry</p>
            <h1 style="margin:0;font-family:sans-serif;font-size:22px;font-weight:700">${data.authority}</h1>
            <p style="margin:4px 0 0;color:#41474e">${data.role}</p>
          </div>
          <div style="padding:24px">
            ${[
              ['Name',          data.name],
              ['Role',          data.role],
              ['Authority',     data.authority],
              ['Email',         data.email],
              ['Phone',         data.phone || '—'],
              ['Interested in', data.interest],
            ].map(([k, v]) => `
              <div style="display:flex;gap:16px;border-bottom:1px solid #dcdfe3;padding:10px 0">
                <span style="min-width:130px;color:#6a717a;font-size:11px;letter-spacing:0.08em;text-transform:uppercase">${k}</span>
                <span style="color:#14171a">${v}</span>
              </div>
            `).join('')}
            <div style="margin-top:20px">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6a717a">Message</p>
              <p style="margin:0;color:#14171a;line-height:1.6;background:#fff;padding:16px;border:1px solid #dcdfe3;border-radius:6px">${data.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from:    'Stredar <admin@stredar.uk>',
      to:      data.email,
      replyTo: 'admin@stredar.uk',
      subject: "We've received your Stredar enquiry",
      html: `
        <div style="font-family:sans-serif;font-size:15px;color:#14171a;max-width:600px;line-height:1.6">
          <div style="background:#ff6b1a;padding:16px 24px">
            <span style="font-family:sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:-0.01em">STREDAR</span>
          </div>
          <div style="padding:32px 24px">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700">Thank you, ${data.name.split(' ')[0]}.</h1>
            <p style="margin:0 0 16px;color:#41474e">We've received your enquiry from ${data.authority} and will be in touch shortly.</p>
            <p style="margin:0 0 16px;color:#41474e">If you have any immediate questions, reply to this email or visit <a href="https://stredar.uk/how-it-works" style="color:#ff6b1a">stredar.uk/how-it-works</a> for more information about the scheme.</p>
            <p style="margin:0;color:#6a717a;font-size:13px">To follow up, reply directly to this email and it will reach our team.</p>
          </div>
          <div style="padding:16px 24px;background:#f5f6f7;border-top:1px solid #eaecee">
            <p style="margin:0;font-family:monospace;font-size:11px;color:#9aa2ab;letter-spacing:0.08em;text-transform:uppercase">Stredar Community Initiative · Not an enforcement device</p>
          </div>
        </div>
      `,
    })

    return { status: 'success' }
  } catch (err) {
    console.error('Resend error:', err)
    return { status: 'error', message: 'Something went wrong sending your enquiry. Please email councils@stredar.uk directly.' }
  }
}
