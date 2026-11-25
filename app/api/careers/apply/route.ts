import { NextResponse } from "next/server";
import prisma from "@/lib/Client";
import nodemailer from "nodemailer";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      jobId,
      name,
      email,
      phone,
      experience,
      portfolioUrl,
      resumeUrl,
      message,
    } = body;

    if (!jobId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Phone)" },
        { status: 400 }
      );
    }

    if (!resumeUrl) {
      return NextResponse.json(
        { success: false, error: "Please upload your resume (PDF) or provide a resume link" },
        { status: 400 }
      );
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "The position you are applying for was not found" },
        { status: 404 }
      );
    }

    if (!job.isOpen) {
      return NextResponse.json(
        { success: false, error: "This job opening is currently closed" },
        { status: 400 }
      );
    }

    // Save application to database
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: experience?.trim() || "Fresher",
        portfolioUrl: portfolioUrl?.trim() || null,
        resumeUrl: resumeUrl?.trim() || null,
        message: message?.trim() || null,
        status: "PENDING",
      },
    });

    // Configure email settings
    const adminEmail = process.env.EMAIL || "studiodavikah@gmail.com";
    const appPassword = process.env.APP_PASS ? process.env.APP_PASS.replace(/\s+/g, "") : "";

    // Determine full resume URL for clickable link
    const host = req.headers.get("host") || "studiodaivikah.com";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const fullResumeUrl = resumeUrl
      ? resumeUrl.startsWith("http")
        ? resumeUrl
        : `${protocol}://${host}${resumeUrl}`
      : null;

    // Attach local resume if uploaded
    const emailAttachments: any[] = [];
    if (resumeUrl && resumeUrl.startsWith("/uploads/resumes/")) {
      const localFilePath = path.join(process.cwd(), "public", resumeUrl);
      emailAttachments.push({
        path: localFilePath,
      });
    }

    // Email to Admin notifying of new applicant
    const adminMailOptions = {
      from: `"Studio Daivikah Careers" <${adminEmail}>`,
      to: adminEmail,
      subject: `New Job Application: ${job.title} - ${name}`,
      attachments: emailAttachments,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; margin: 0; padding: 24px; color: #1e293b; }
            .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background: #0f172a; padding: 24px; color: #ffffff; }
            .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; color: #ffffff; }
            .header p { margin: 0; font-size: 14px; color: #94a3b8; }
            .content { padding: 24px; }
            .info-grid { display: grid; grid-gap: 14px; margin-bottom: 20px; }
            .row { border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
            .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
            .value { font-size: 15px; color: #0f172a; font-weight: 500; word-break: break-word; }
            .btn { display: inline-block; padding: 10px 18px; background: #0f172a; color: #ffffff !important; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; margin-top: 6px; margin-right: 8px; }
            .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>New Job Application Received</h2>
              <p>Position: <strong>${job.title}</strong> (${job.department})</p>
            </div>
            <div class="content">
              <div class="info-grid">
                <div class="row">
                  <div class="label">Candidate Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="row">
                  <div class="label">Email Address</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="row">
                  <div class="label">Phone Number</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                <div class="row">
                  <div class="label">Experience Level</div>
                  <div class="value">${experience || "Fresher"}</div>
                </div>
                ${
                  fullResumeUrl
                    ? `<div class="row">
                        <div class="label">Resume / CV ${emailAttachments.length > 0 ? "(Also attached to this email)" : "Link"}</div>
                        <div class="value">
                          <a href="${fullResumeUrl}" target="_blank" class="btn" style="color:#ffffff;">View / Download Resume &rarr;</a>
                        </div>
                      </div>`
                    : ""
                }
                ${
                  portfolioUrl
                    ? `<div class="row">
                        <div class="label">Portfolio / Work Link</div>
                        <div class="value">
                          <a href="${portfolioUrl}" target="_blank" class="btn" style="background:#475569; color:#ffffff;">View Portfolio &rarr;</a>
                        </div>
                      </div>`
                    : ""
                }
                ${
                  message
                    ? `<div class="row">
                        <div class="label">Candidate Message / Note</div>
                        <div class="value" style="white-space: pre-line; background: #f8fafc; padding: 12px; border-radius: 6px;">${message}</div>
                      </div>`
                    : ""
                }
              </div>
              <p style="font-size: 13px; color: #64748b;">
                You can review, shortlist, or update applicant statuses anytime in your Studio Daivikah Admin Panel.
              </p>
            </div>
            <div class="footer">
              &copy; Studio Daivikah &bull; Careers Portal Automated Notification
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Thank you email to candidate
    const candidateMailOptions = {
      from: `"Studio Daivikah" <${adminEmail}>`,
      to: email,
      subject: `Thank you for applying to Studio Daivikah - ${job.title}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; margin: 0; padding: 24px; color: #1e293b; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background: #000000; padding: 32px 24px; text-align: center; }
            .logo-text { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; }
            .content { padding: 32px 28px; line-height: 1.6; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
            .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; }
            .details-item { margin-bottom: 8px; }
            .details-item:last-child { margin-bottom: 0; }
            .footer { padding: 20px 24px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="logo-text">Studio Daivikah</h1>
            </div>
            <div class="content">
              <div class="greeting">Dear ${name},</div>
              <p>
                Thank you for your interest in joining <strong>Studio Daivikah</strong>! We have successfully received your application for the position of <strong>${job.title}</strong>.
              </p>
              
              <div class="details-box">
                <div class="details-item"><strong>Position:</strong> ${job.title}</div>
                <div class="details-item"><strong>Department:</strong> ${job.department}</div>
                <div class="details-item"><strong>Location:</strong> ${job.location}</div>
                <div class="details-item"><strong>Status:</strong> Under Review</div>
              </div>

              <p>
                Our hiring team is currently reviewing your application, qualifications, and portfolio. If your background and experience align with what we are looking for, we will reach out to you directly to arrange the next steps.
              </p>

              <p>
                We truly appreciate the time and effort you invested in applying to Studio Daivikah.
              </p>

              <p style="margin-top: 24px; margin-bottom: 4px;">Warm regards,</p>
              <p style="margin: 0; font-weight: 600; color: #0f172a;">Studio Daivikah Talent Team</p>
              <p style="margin: 0; font-size: 13px; color: #64748b;">Chennai, Tamil Nadu</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Studio Daivikah. All rights reserved.<br />
              <a href="https://studiodaivikah.com" style="color: #0284c7; text-decoration: none;">www.studiodaivikah.com</a>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails
    const emailStatus = { adminSent: false, candidateSent: false, error: null as string | null };

    if (adminEmail && appPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: adminEmail,
            pass: appPassword,
          },
        });

        const [adminResult, candidateResult] = await Promise.allSettled([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(candidateMailOptions),
        ]);

        if (adminResult.status === "fulfilled") {
          console.log("✅ Admin notification email sent successfully");
          emailStatus.adminSent = true;
        } else {
          console.error("❌ Failed to send admin email:", adminResult.reason);
          emailStatus.error = String(adminResult.reason?.message || adminResult.reason);
        }

        if (candidateResult.status === "fulfilled") {
          console.log("✅ Candidate confirmation email sent successfully");
          emailStatus.candidateSent = true;
        } else {
          console.error("❌ Failed to send candidate email:", candidateResult.reason);
          emailStatus.error = String(candidateResult.reason?.message || candidateResult.reason);
        }
      } catch (err: any) {
        console.error("❌ Nodemailer transporter error:", err);
        emailStatus.error = err?.message || String(err);
      }
    } else {
      console.warn("⚠️ Cannot send emails: EMAIL or APP_PASS missing from .env");
      emailStatus.error = "EMAIL or APP_PASS is not configured in .env";
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully!",
        applicationId: application.id,
        emailStatus,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
