"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StepIndicator } from "@/components/registration/step-indicator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function RegisterWaiverPage() {
  const [accepted, setAccepted] = useState(false)
  const [signature, setSignature] = useState("")

  const canContinue = accepted && signature.trim().length > 0

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={4} />
      <PageHeader
        title="Accept Waiver"
        description="Review and sign the liability waiver, terms, and media release"
      />

      <Card>
        <CardContent className="space-y-6">
          <ScrollArea className="h-72 rounded-lg border p-4">
            <div className="space-y-4 text-sm text-muted-foreground pr-4">
              <h3 className="text-base font-semibold text-foreground">
                Studio OS Dance Academy -- Liability Waiver, Terms of Service & Media Release
              </h3>
              <p className="text-xs text-muted-foreground">
                Effective Date: January 1, 2026
              </p>

              <Separator />

              <h4 className="font-semibold text-foreground">1. Assumption of Risk</h4>
              <p>
                I acknowledge that participation in dance classes, workshops, performances, and
                related activities involves inherent risks of physical injury, including but not
                limited to sprains, strains, fractures, and other musculoskeletal injuries. I
                voluntarily assume all such risks and agree to hold harmless Studio OS Dance Academy,
                its owners, instructors, staff, and affiliates from any and all claims, liabilities,
                damages, or expenses arising from participation in studio activities.
              </p>

              <h4 className="font-semibold text-foreground">2. Medical Authorization</h4>
              <p>
                In the event of an emergency, I authorize Studio OS Dance Academy staff to seek
                appropriate medical treatment for my child or myself. I understand that I am
                responsible for all medical expenses incurred. I agree to disclose any relevant
                medical conditions, allergies, or physical limitations that may affect participation
                in classes.
              </p>

              <h4 className="font-semibold text-foreground">3. Code of Conduct</h4>
              <p>
                All students and families are expected to treat instructors, staff, and fellow
                students with respect and courtesy. Disruptive behavior may result in temporary
                or permanent dismissal from the program without refund. Students must arrive
                prepared with appropriate attire and footwear as specified for each class discipline.
              </p>

              <h4 className="font-semibold text-foreground">4. Tuition & Payment Terms</h4>
              <p>
                Monthly tuition is due on the 1st of each month. A late fee of $25 will be applied
                to payments received after the 15th. Returned checks or declined payments will incur
                a $35 processing fee. Families with outstanding balances exceeding 30 days may have
                class participation suspended until the account is brought current.
              </p>

              <h4 className="font-semibold text-foreground">5. Withdrawal & Refund Policy</h4>
              <p>
                Withdrawal from classes requires 30 days written notice. No refunds will be issued
                for partial months. Registration fees are non-refundable. Costume fees and recital
                participation fees are non-refundable once orders have been placed with vendors.
              </p>

              <h4 className="font-semibold text-foreground">6. Attendance & Makeup Policy</h4>
              <p>
                Regular attendance is essential for student progress and class cohesion. Missed
                classes may be made up in an equivalent-level class within the same month, subject
                to availability. No credits or refunds will be issued for missed classes beyond
                the makeup window.
              </p>

              <h4 className="font-semibold text-foreground">7. Media Release</h4>
              <p>
                I hereby grant Studio OS Dance Academy permission to photograph, video record, or
                otherwise capture the likeness of my child and/or myself during classes,
                performances, and studio events. These images may be used for promotional purposes
                including but not limited to the studio website, social media accounts, printed
                materials, and advertising. I waive any right to compensation or approval of
                the finished product.
              </p>

              <h4 className="font-semibold text-foreground">8. Communication</h4>
              <p>
                By enrolling, I consent to receive communications from Studio OS Dance Academy
                via email, SMS, and phone regarding class schedules, studio announcements, billing
                notices, and promotional materials. I understand I may opt out of promotional
                communications at any time.
              </p>

              <h4 className="font-semibold text-foreground">9. Governing Law</h4>
              <p>
                This agreement shall be governed by and construed in accordance with the laws of
                the State of New Jersey. Any disputes arising from this agreement shall be resolved
                in the courts of Union County, New Jersey.
              </p>

              <Separator />

              <p className="text-xs">
                By signing below, I acknowledge that I have read, understood, and agree to all
                terms and conditions outlined in this document. I confirm that I am the legal
                guardian of the student(s) being enrolled and have the authority to enter into
                this agreement on their behalf.
              </p>
            </div>
          </ScrollArea>

          <div className="flex items-start gap-3">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <Label htmlFor="accept" className="leading-normal cursor-pointer">
              I have read and accept the terms and conditions, liability waiver, and media release
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature">
              Digital Signature
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                (type your full name)
              </span>
            </Label>
            <Input
              id="signature"
              placeholder="Jennifer Anderson"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="font-serif italic text-base"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4">
        <Link href="/register/classes">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href={canContinue ? "/register/payment" : "#"}>
          <Button disabled={!canContinue}>Continue</Button>
        </Link>
      </div>
    </div>
  )
}
