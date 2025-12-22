# Email: Deployment Update

**To:** Sarah, Julie, Darryl

**Subject:** MyPlanForSuccess is live for testing

---

Hi all,

Greetings from Down Under!

I've deployed the app to Vercel and it's ready for testing. You can test using this URL:

https://darryl-speak-online-business-plan.vercel.app/

I'm still making refinements and finalising other features (eg. Admin Dashboard, Home Page, and various tweaks), but there's enough there to get a feel for the full experience.


**Testing Tips**

- **Power Agent SSO:** I highly recommend testing the "Continue with Power Agent" login flow
- **Email signup:** You can also sign up with just an email on the login form (this can be turned off later if you want Power Agent-only access)
- **Use incognito windows when testing different accounts:** This is an important one. We cache some data locally for speed, so switching accounts in the same browser can show stale data. We're cleaning this up, but for now incognito is the safest way to test multiple logins.


**What to Look For**

As you go through, it'd be helpful to note:
- What you like
- What you don't like
- Suggested refinements (wording, layout, usability)

Pay special attention to the **Goals section in Section 1**. This got a major redesign. The original was pretty flat (just text fields), which made it tedious to fill out. It's now an interactive per-goal breakdown flow that connects to the Manifest List in Section 3.

**Feedback:** I've set up a shared doc for capturing your notes as you test — just add bullet points as you go, don't overthink it:

https://docs.google.com/document/d/17Ynr6HcJf5lfXDNp_EFy4nD6CiCPapIch4tRPDGnUTo/edit?tab=t.0


**Legal Pages**

I'll be using some templated content for the Privacy Policy and Terms of Service pages. You'll want to review these and send us any updates in a Google Doc or Word doc.


**Domain Setup**

When you're ready to point myplanforsuccess.com to the app, you'll need to add this DNS record at your domain registrar:

A Record: @ points to 76.76.21.21

If you also want www.myplanforsuccess.com to work, add:

CNAME: www → cname.vercel-dns.com

Let me know if you need help finding where to do this — happy to jump on a quick call.


Let me know how testing goes!

Paul
