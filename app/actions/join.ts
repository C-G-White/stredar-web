'use server'

import { Resend } from 'resend'

export type JoinFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'validation'; errors: Partial<Record<string, string>> }

const resend = new Resend(process.env.RESEND_API_KEY)

function validate(data: Record<string, string>): Partial<Record<string, string>> | null {
  const errors: Partial<Record<string, string>> = {}

  if (!data.name?.trim() || data.name.trim().length < 2)
    errors.name = 'Please enter your full name.'
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Please enter a valid email address.'
  if (!data.group?.trim())
    errors.group = 'Please enter your community group or organisation name.'
  if (!data.location?.trim())
    errors.location = 'Please enter your village, town, and county.'
  if (!data.concern?.trim() || data.concern.trim().length < 20)
    errors.concern = 'Please describe your road safety concern (at least 20 characters).'
  if (!data.council)
    errors.council = 'Please select an option.'

  return Object.keys(errors).length ? errors : null
}

export async function submitJoinEnquiry(
  _prev: JoinFormState,
  formData: FormData,
): Promise<JoinFormState> {
  // Honeypot — bots fill this, humans don't
  if (formData.get('_gotcha')) return { status: 'idle' }

  const data = {
    name:     String(formData.get('name')    ?? ''),
    email:    String(formData.get('email')   ?? ''),
    group:    String(formData.get('group')   ?? ''),
    location: String(formData.get('location')?? ''),
    concern:  String(formData.get('concern') ?? ''),
    council:  String(formData.get('council') ?? ''),
    source:   String(formData.get('source')  ?? ''),
  }

  const errors = validate(data)
  if (errors) return { status: 'validation', errors }

  try {
    // Notification to Stredar team
    await resend.emails.send({
      from: 'Stredar Enquiries <noreply@stredar.uk>',
      to:   'join@stredar.uk',
      replyTo: data.email,
      subject: `New Scheme Enquiry — ${data.group}, ${data.location}`,
      html: `
        <div style="font-family:monospace;font-size:14px;color:#14171a;max-width:600px">
          <div style="background:#ff6b1a;padding:16px 24px">
            <span style="font-family:sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:-0.01em">STREDAR</span>
          </div>
          <div style="padding:24px;background:#f5f6f7;border-bottom:3px solid #ff6b1a">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6a717a">New Scheme Enquiry</p>
            <h1 style="margin:0;font-family:sans-serif;font-size:22px;font-weight:700">${data.group}</h1>
            <p style="margin:4px 0 0;color:#41474e">${data.location}</p>
          </div>
          <div style="padding:24px">
            ${[
              ['Name',            data.name],
              ['Email',           data.email],
              ['Community group', data.group],
              ['Location',        data.location],
              ['Council contact', data.council],
              ['Heard about us',  data.source || '—'],
            ].map(([k, v]) => `
              <div style="display:flex;gap:16px;border-bottom:1px solid #dcdfe3;padding:10px 0">
                <span style="min-width:140px;color:#6a717a;font-size:11px;letter-spacing:0.08em;text-transform:uppercase">${k}</span>
                <span style="color:#14171a">${v}</span>
              </div>
            `).join('')}
            <div style="margin-top:20px">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6a717a">Road Safety Concern</p>
              <p style="margin:0;color:#14171a;line-height:1.6;background:#fff;padding:16px;border:1px solid #dcdfe3;border-radius:6px">${data.concern.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      `,
    })

    // Confirmation to enquirer
    await resend.emails.send({
      from: 'Stredar <noreply@stredar.uk>',
      to:   data.email,
      subject: 'We\'ve received your Stredar enquiry',
      html: `
        <div style="font-family:sans-serif;font-size:15px;color:#14171a;max-width:600px;line-height:1.6">
          <div style="background:#ff6b1a;padding:16px 24px">
            <span style="font-family:sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:-0.01em">STREDAR</span>
          </div>
          <div style="padding:32px 24px">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700">Thanks, ${data.name.split(' ')[0]}.</h1>
            <p style="margin:0 0 16px;color:#41474e">We've received your enquiry about deploying a Stredar unit in ${data.location}. We'll review your submission and be in touch shortly.</p>
            <p style="margin:0 0 16px;color:#41474e">In the meantime, you can read more about how Stredar works at <a href="https://stredar.uk/how-it-works" style="color:#ff6b1a">stredar.uk/how-it-works</a>.</p>
            <p style="margin:0;color:#6a717a;font-size:13px">This is an automated confirmation. To follow up, reply directly to this email.</p>
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
    return { status: 'error', message: 'Something went wrong sending your enquiry. Please try again or email join@stredar.uk directly.' }
  }
}
