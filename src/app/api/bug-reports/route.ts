import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const bugReportSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  section: z.string().min(1),
  description: z.string().min(10),
});

const SECTION_LABELS: Record<string, string> = {
  'dashboard': 'Dashboard',
  'section-1': 'Section 1: Annual Reflection',
  'section-2': 'Section 2: SWOT Analysis',
  'section-3': 'Section 3: Vision, Goals & Income',
  'section-4': 'Section 4: Mindset & Self-Care',
  'section-5': 'Section 5: Accountability',
  'other': 'Other / Not sure',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bugReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, section, description } = parsed.data;
    const sectionLabel = SECTION_LABELS[section] || section;

    // Get current user (if authenticated)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Store in database
    const { error: dbError } = await supabase.from('bug_reports').insert({
      user_id: user?.id || null,
      user_name: name,
      user_email: email,
      section: section,
      description: description,
    });

    if (dbError) {
      console.error('Error storing bug report:', dbError);
      // Continue with email even if DB fails - we don't want to lose the report
    }

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const bugReportEmails = process.env.BUG_REPORT_EMAILS?.split(',').map((e) => e.trim()) || [];

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      // Still return success if DB worked - email is secondary
      if (!dbError) {
        return NextResponse.json({
          success: true,
          data: { message: 'Report saved (email notification pending configuration)' },
        });
      }
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: 'Unable to submit report. Please try again later.' }],
        },
        { status: 500 }
      );
    }

    if (bugReportEmails.length === 0) {
      console.error('BUG_REPORT_EMAILS not configured');
    }

    const resend = new Resend(resendApiKey);

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2744;">New Bug Report - My Plan For Success</h2>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 120px;">From:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name} (${email})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Section:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${sectionLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">User ID:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${user?.id || 'Not logged in'}</td>
          </tr>
        </table>

        <h3 style="color: #1a2744; margin-top: 24px;">Description</h3>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${description}</div>

        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          Submitted at ${new Date().toISOString()}
        </p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'My Plan For Success <support@myplanforsuccess.com>',
        to: bugReportEmails.length > 0 ? bugReportEmails : ['paul@pbdigital.com.au'],
        bcc: ['paul@pbdigital.com.au'],
        replyTo: email,
        subject: `[Bug Report] ${sectionLabel} - ${name}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // If DB succeeded, still return success
      if (!dbError) {
        return NextResponse.json({
          success: true,
          data: { message: 'Report saved (email notification failed)' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Bug report submitted successfully' },
    });
  } catch (error) {
    console.error('Unexpected error in bug report:', error);
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'An unexpected error occurred' }],
      },
      { status: 500 }
    );
  }
}
