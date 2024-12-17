import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { APIResponse } from "@/types/APIResponse";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<APIResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react:VerificationEmail({ username, otp })
        })
        return { success: true, message: "Verification email sent successfully" }
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Failed to send verification email" }
    }
}