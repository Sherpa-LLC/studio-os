import type { Review } from "@/lib/types"

export const reviews: Review[] = [
  { id: "rev-001", platform: "google", author: "Jennifer A.", rating: 5, body: "My daughters have been dancing here for 3 years and we absolutely love it! The instructors are patient, kind, and truly talented. Recitals are always beautifully done.", date: "2026-03-28", responded: true, responseBody: "Thank you so much, Jennifer! We love having Emma and Sophie in class. See you at the Spring Showcase!" },
  { id: "rev-002", platform: "google", author: "Maria G.", rating: 5, body: "Amazing studio with wonderful teachers! All three of my kids attend and each one has grown so much. The front desk staff is also incredibly helpful.", date: "2026-03-25", responded: true, responseBody: "We appreciate you trusting us with all three of your dancers, Maria! They bring such energy to every class." },
  { id: "rev-003", platform: "google", author: "Lisa T.", rating: 5, body: "Best dance studio in the area! Clean facilities, professional staff, and my girls look forward to class every single week.", date: "2026-03-22", responded: false },
  { id: "rev-004", platform: "google", author: "David C.", rating: 4, body: "Great studio overall. My daughter loves her ballet class. Only reason for 4 stars is parking can be tricky during pick-up time.", date: "2026-03-20", responded: true, responseBody: "Thanks for the feedback, David! We're actually working with the shopping center on additional parking. Glad your daughter loves ballet!" },
  { id: "rev-005", platform: "google", author: "Priya P.", rating: 5, body: "The competition team program is incredible. My daughters have improved dramatically and the choreography is always stunning.", date: "2026-03-18", responded: false },
  { id: "rev-006", platform: "facebook", author: "Keiko T.", rating: 5, body: "We switched from another studio and it was the best decision! The teachers here really care about each child. Highly recommend!", date: "2026-03-15", responded: true, responseBody: "Welcome to the family, Keiko! We're thrilled you chose us." },
  { id: "rev-007", platform: "google", author: "Tom B.", rating: 4, body: "Good variety of classes and very organized recital. My daughter tried the summer intensive last year and loved it.", date: "2026-03-12", responded: false },
  { id: "rev-008", platform: "yelp", author: "Angela R.", rating: 5, body: "Five stars! The studio is always clean, the teachers are amazing, and the communication from the office is top-notch. Love the parent portal too.", date: "2026-03-10", responded: true, responseBody: "Thank you Angela! We put a lot of work into making communication seamless. Glad it's paying off!" },
  { id: "rev-009", platform: "google", author: "Rachel P.", rating: 5, body: "We just started with the Tiny Tots program and my 4 year old is obsessed! She practices her moves all day at home. Miss Elena is wonderful.", date: "2026-03-08", responded: false },
  { id: "rev-010", platform: "facebook", author: "Marcus W.", rating: 4, body: "My son started hip hop and really enjoys it. Nice to see a studio that welcomes boys too. Coach Marcus is a great role model.", date: "2026-03-05", responded: true, responseBody: "Thank you, Marcus! We're so glad Jayden is enjoying hip hop. Coach Marcus is amazing with the kids!" },
  { id: "rev-011", platform: "google", author: "Susan C.", rating: 3, body: "The classes are good but I wish there were more contemporary options for the 10-12 age group. My daughter is too advanced for juniors but not ready for teens.", date: "2026-03-02", responded: true, responseBody: "Hi Susan, great feedback! We're actually adding a pre-teen contemporary class for the fall season. We'd love to have Emma in it!" },
  { id: "rev-012", platform: "yelp", author: "Nina K.", rating: 5, body: "Beautiful studio, great teachers, wonderful community. My daughter has made so many friends here. Worth every penny!", date: "2026-02-28", responded: false },
  { id: "rev-013", platform: "google", author: "Carlos M.", rating: 5, body: "Found this studio through Instagram and so glad we did! Sofia is thriving in the hip hop program.", date: "2026-02-25", responded: false },
  { id: "rev-014", platform: "google", author: "Emily W.", rating: 4, body: "Love the recitals and showcase events. The studio does a great job making every dancer feel special regardless of level.", date: "2026-02-20", responded: false },
  { id: "rev-015", platform: "facebook", author: "Amanda S.", rating: 5, body: "We just did a trial class and my daughter is already begging to go back! Signing up this week.", date: "2026-02-15", responded: true, responseBody: "That's wonderful to hear, Amanda! We can't wait to welcome Lily officially!" },
  { id: "rev-016", platform: "google", author: "Robert T.", rating: 5, body: "As a dad who knows nothing about dance, I appreciate how welcoming and informative the staff is. My girls are learning discipline and artistry.", date: "2026-02-10", responded: false },
  { id: "rev-017", platform: "yelp", author: "Grace L.", rating: 4, body: "Great instruction and nice facilities. Would love to see some adult beginner classes added to the schedule.", date: "2026-02-05", responded: true, responseBody: "Hi Grace! We do have Adult Ballet and Adult Hip Hop on our schedule — check the class listings! We'd love to have you." },
  { id: "rev-018", platform: "google", author: "Michelle R.", rating: 5, body: "The Spring Showcase last year was incredible! Professional quality show. You can tell the instructors put their hearts into it.", date: "2026-01-28", responded: false },
  { id: "rev-019", platform: "google", author: "Jason H.", rating: 3, body: "Classes are good but communication about schedule changes could be better. Found out about a cancellation through another parent.", date: "2026-01-20", responded: true, responseBody: "Jason, we apologize for that! We've since improved our notification system — all changes now go out via text and email immediately. Thank you for the honest feedback." },
  { id: "rev-020", platform: "facebook", author: "Sandra K.", rating: 5, body: "My daughter has been dancing here since she was 3 and she's now on the competition team at 12. This studio has been like a second family to us.", date: "2026-01-15", responded: true, responseBody: "Sandra, this means the world to us! Watching your daughter grow from Tiny Tots to competition team has been one of our greatest joys." },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getAverageRating(): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((total, r) => total + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function getResponseRate(): number {
  if (reviews.length === 0) return 0
  const responded = reviews.filter((r) => r.responded).length
  return Math.round((responded / reviews.length) * 100)
}

export function getReviewsThisMonth(): number {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  return reviews.filter((r) => new Date(r.date + "T00:00:00") >= monthStart).length
}
