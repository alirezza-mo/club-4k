# Diff Details

Date : 2025-10-30 11:59:51

Directory a:\\projects\\club-4k

Total : 117 files,  11043 codes, 122 comments, 662 blanks, all 11827 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 43 | 0 | 20 | 63 |
| [configs/db.js](/configs/db.js) | JavaScript | 24 | 0 | 4 | 28 |
| [jsconfig.json](/jsconfig.json) | JSON with Comments | 7 | 0 | 1 | 8 |
| [liara.json](/liara.json) | JSON | 8 | 0 | 0 | 8 |
| [models/Admin.js](/models/Admin.js) | JavaScript | 21 | 0 | 2 | 23 |
| [models/Challenge.js](/models/Challenge.js) | JavaScript | 19 | 2 | 3 | 24 |
| [models/Chat.js](/models/Chat.js) | JavaScript | 26 | 0 | 3 | 29 |
| [models/Comment.js](/models/Comment.js) | JavaScript | 24 | 0 | 3 | 27 |
| [models/Console.js](/models/Console.js) | JavaScript | 32 | 0 | 5 | 37 |
| [models/Echo.js](/models/Echo.js) | JavaScript | 21 | 0 | 3 | 24 |
| [models/GameSession.js](/models/GameSession.js) | JavaScript | 63 | 2 | 6 | 71 |
| [models/News.js](/models/News.js) | JavaScript | 23 | 0 | 3 | 26 |
| [models/Otp.js](/models/Otp.js) | JavaScript | 11 | 0 | 4 | 15 |
| [models/Ticket.js](/models/Ticket.js) | JavaScript | 46 | 0 | 4 | 50 |
| [models/Users.js](/models/Users.js) | JavaScript | 58 | 2 | 3 | 63 |
| [next.config.mjs](/next.config.mjs) | JavaScript | 9 | 1 | 2 | 12 |
| [package-lock.json](/package-lock.json) | JSON | 5,688 | 0 | 1 | 5,689 |
| [package.json](/package.json) | JSON | 45 | 0 | 1 | 46 |
| [postcss.config.mjs](/postcss.config.mjs) | JavaScript | 4 | 0 | 2 | 6 |
| [public/file.svg](/public/file.svg) | XML | 1 | 0 | 0 | 1 |
| [public/globe.svg](/public/globe.svg) | XML | 1 | 0 | 0 | 1 |
| [public/next.svg](/public/next.svg) | XML | 1 | 0 | 0 | 1 |
| [public/vercel.svg](/public/vercel.svg) | XML | 1 | 0 | 0 | 1 |
| [public/window.svg](/public/window.svg) | XML | 1 | 0 | 0 | 1 |
| [src/app/api/auth/forgotPassword/resetPassword/route.js](/src/app/api/auth/forgotPassword/resetPassword/route.js) | JavaScript | 51 | 0 | 8 | 59 |
| [src/app/api/auth/forgotPassword/send/route.js](/src/app/api/auth/forgotPassword/send/route.js) | JavaScript | 59 | 0 | 6 | 65 |
| [src/app/api/auth/forgotPassword/verify/route.js](/src/app/api/auth/forgotPassword/verify/route.js) | JavaScript | 36 | 0 | 4 | 40 |
| [src/app/api/auth/loginAdmin/route.js](/src/app/api/auth/loginAdmin/route.js) | JavaScript | -1 | 0 | 0 | -1 |
| [src/app/api/auth/loginUser/route.js](/src/app/api/auth/loginUser/route.js) | JavaScript | 76 | 0 | 10 | 86 |
| [src/app/api/auth/registerAdmin/route.js](/src/app/api/auth/registerAdmin/route.js) | JavaScript | 8 | 0 | 0 | 8 |
| [src/app/api/auth/signOutAdmin/route.js](/src/app/api/auth/signOutAdmin/route.js) | JavaScript | 45 | 0 | 10 | 55 |
| [src/app/api/auth/signin/route.js](/src/app/api/auth/signin/route.js) | JavaScript | 14 | -6 | 0 | 8 |
| [src/app/api/auth/sms/send/route.js](/src/app/api/auth/sms/send/route.js) | JavaScript | 7 | -1 | -1 | 5 |
| [src/app/api/challenge/\[id\]/route.js](/src/app/api/challenge/%5Bid%5D/route.js) | JavaScript | 86 | 0 | 4 | 90 |
| [src/app/api/challenge/route.js](/src/app/api/challenge/route.js) | JavaScript | 118 | 2 | 19 | 139 |
| [src/app/api/chat/route.js](/src/app/api/chat/route.js) | JavaScript | 86 | 2 | 14 | 102 |
| [src/app/api/comment/route.js](/src/app/api/comment/route.js) | JavaScript | 45 | 0 | 13 | 58 |
| [src/app/api/console/\[barcode\]/route.js](/src/app/api/console/%5Bbarcode%5D/route.js) | JavaScript | 39 | 3 | 8 | 50 |
| [src/app/api/console/route.js](/src/app/api/console/route.js) | JavaScript | 46 | 1 | 9 | 56 |
| [src/app/api/echo/route.js](/src/app/api/echo/route.js) | JavaScript | 49 | 0 | 12 | 61 |
| [src/app/api/gameNet/route.js](/src/app/api/gameNet/route.js) | JavaScript | 8 | 0 | 2 | 10 |
| [src/app/api/locations/route.js](/src/app/api/locations/route.js) | JavaScript | 0 | 0 | 1 | 1 |
| [src/app/api/news/route.js](/src/app/api/news/route.js) | JavaScript | 59 | 0 | 6 | 65 |
| [src/app/api/profile/edit/route.js](/src/app/api/profile/edit/route.js) | JavaScript | 67 | 0 | 16 | 83 |
| [src/app/api/sessions/confirm-result/route.js](/src/app/api/sessions/confirm-result/route.js) | JavaScript | 95 | 8 | 20 | 123 |
| [src/app/api/sessions/current-status/route.js](/src/app/api/sessions/current-status/route.js) | JavaScript | 33 | 4 | 8 | 45 |
| [src/app/api/sessions/end-scan/route.js](/src/app/api/sessions/end-scan/route.js) | JavaScript | 199 | 4 | 17 | 220 |
| [src/app/api/sessions/scan/route.js](/src/app/api/sessions/scan/route.js) | JavaScript | 269 | 10 | 28 | 307 |
| [src/app/api/sessions/submit-result/route.js](/src/app/api/sessions/submit-result/route.js) | JavaScript | 72 | 7 | 16 | 95 |
| [src/app/api/ticket/answer/route.js](/src/app/api/ticket/answer/route.js) | JavaScript | 46 | 0 | 6 | 52 |
| [src/app/api/ticket/route.js](/src/app/api/ticket/route.js) | JavaScript | 34 | 1 | 10 | 45 |
| [src/app/api/users/\[userId\]/route.js](/src/app/api/users/%5BuserId%5D/route.js) | JavaScript | 16 | 0 | 2 | 18 |
| [src/app/api/users/route.js](/src/app/api/users/route.js) | JavaScript | 8 | 0 | 2 | 10 |
| [src/app/challenge/page.jsx](/src/app/challenge/page.jsx) | JavaScript JSX | -91 | -6 | -14 | -111 |
| [src/app/comment/page.jsx](/src/app/comment/page.jsx) | JavaScript JSX | 18 | 0 | 2 | 20 |
| [src/app/forget-password/page.jsx](/src/app/forget-password/page.jsx) | JavaScript JSX | -73 | 0 | -6 | -79 |
| [src/app/globals.css](/src/app/globals.css) | PostCSS | 5 | 0 | 1 | 6 |
| [src/app/layout.js](/src/app/layout.js) | JavaScript | -6 | 0 | 1 | -5 |
| [src/app/p-admin/challenges/page.jsx](/src/app/p-admin/challenges/page.jsx) | JavaScript JSX | 25 | 0 | 1 | 26 |
| [src/app/p-admin/news/page.jsx](/src/app/p-admin/news/page.jsx) | JavaScript JSX | 50 | 0 | 6 | 56 |
| [src/app/p-admin/page.jsx](/src/app/p-admin/page.jsx) | JavaScript JSX | 4 | 0 | 3 | 7 |
| [src/app/p-user/challenge/page.jsx](/src/app/p-user/challenge/page.jsx) | JavaScript JSX | 46 | 0 | 9 | 55 |
| [src/app/p-user/editprofile/page.jsx](/src/app/p-user/editprofile/page.jsx) | JavaScript JSX | -42 | 0 | -9 | -51 |
| [src/app/p-user/tickets/\[id\]/page.jsx](/src/app/p-user/tickets/%5Bid%5D/page.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [src/app/page.js](/src/app/page.js) | JavaScript | 2 | 0 | 1 | 3 |
| [src/app/profile/\[userId\]/page.jsx](/src/app/profile/%5BuserId%5D/page.jsx) | JavaScript JSX | 5 | 0 | 2 | 7 |
| [src/app/profile/page.jsx](/src/app/profile/page.jsx) | JavaScript JSX | -102 | -2 | -4 | -108 |
| [src/app/randomsentence/page.jsx](/src/app/randomsentence/page.jsx) | JavaScript JSX | -46 | 0 | -4 | -50 |
| [src/app/resetPassword/\[url\]/page.jsx](/src/app/resetPassword/%5Burl%5D/page.jsx) | JavaScript JSX | 10 | 0 | 2 | 12 |
| [src/app/scan-session/page.jsx](/src/app/scan-session/page.jsx) | JavaScript JSX | 820 | 30 | 63 | 913 |
| [src/components/layouts/UserPanelLayout.jsx](/src/components/layouts/UserPanelLayout.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [src/components/modules/ChallengeBox/ChallengeBox.jsx](/src/components/modules/ChallengeBox/ChallengeBox.jsx) | JavaScript JSX | 22 | 0 | 4 | 26 |
| [src/components/modules/Comment/Comment.jsx](/src/components/modules/Comment/Comment.jsx) | JavaScript JSX | 0 | 0 | 3 | 3 |
| [src/components/modules/MotivationBox/MotivationBox.jsx](/src/components/modules/MotivationBox/MotivationBox.jsx) | JavaScript JSX | -4 | 0 | 0 | -4 |
| [src/components/modules/Navbar/Navbar.jsx](/src/components/modules/Navbar/Navbar.jsx) | JavaScript JSX | 1 | 0 | 2 | 3 |
| [src/components/modules/NewsBox/NewsBox.jsx](/src/components/modules/NewsBox/NewsBox.jsx) | JavaScript JSX | -4 | 5 | 3 | 4 |
| [src/components/modules/P-admin/NewsBoxAdminPanel.jsx](/src/components/modules/P-admin/NewsBoxAdminPanel.jsx) | JavaScript JSX | 27 | 0 | 3 | 30 |
| [src/components/modules/P-admin/SideBar.jsx](/src/components/modules/P-admin/SideBar.jsx) | JavaScript JSX | 25 | 0 | 3 | 28 |
| [src/components/templates/Profile/ChallengeArticle.jsx](/src/components/templates/Profile/ChallengeArticle.jsx) | JavaScript JSX | 64 | 2 | 2 | 68 |
| [src/components/templates/Profile/ProfilePageTemplate.jsx](/src/components/templates/Profile/ProfilePageTemplate.jsx) | JavaScript JSX | 431 | 1 | 14 | 446 |
| [src/components/templates/challenge/ChallengeCard.jsx](/src/components/templates/challenge/ChallengeCard.jsx) | JavaScript JSX | 43 | 1 | 3 | 47 |
| [src/components/templates/challenge/ChallengeForm.jsx](/src/components/templates/challenge/ChallengeForm.jsx) | JavaScript JSX | 103 | -2 | 4 | 105 |
| [src/components/templates/challenge/ChallengeSection.jsx](/src/components/templates/challenge/ChallengeSection.jsx) | JavaScript JSX | 172 | 5 | 22 | 199 |
| [src/components/templates/comment/Comment.jsx](/src/components/templates/comment/Comment.jsx) | JavaScript JSX | 81 | 0 | 11 | 92 |
| [src/components/templates/echo/Echo.jsx](/src/components/templates/echo/Echo.jsx) | JavaScript JSX | 87 | 0 | 15 | 102 |
| [src/components/templates/forgotPassword/ForgotPassword.jsx](/src/components/templates/forgotPassword/ForgotPassword.jsx) | JavaScript JSX | 251 | 0 | 10 | 261 |
| [src/components/templates/index/Challenge/Challenge.jsx](/src/components/templates/index/Challenge/Challenge.jsx) | JavaScript JSX | 17 | 1 | 6 | 24 |
| [src/components/templates/index/Comments/Comments.jsx](/src/components/templates/index/Comments/Comments.jsx) | JavaScript JSX | 14 | 0 | 1 | 15 |
| [src/components/templates/index/Leaderboard/Leaderboard.jsx](/src/components/templates/index/Leaderboard/Leaderboard.jsx) | JavaScript JSX | 6 | 0 | 0 | 6 |
| [src/components/templates/index/Motivational/Motivational.jsx](/src/components/templates/index/Motivational/Motivational.jsx) | JavaScript JSX | 14 | 0 | 0 | 14 |
| [src/components/templates/index/News/News.jsx](/src/components/templates/index/News/News.jsx) | JavaScript JSX | 55 | 0 | 3 | 58 |
| [src/components/templates/index/chat/Chat.jsx](/src/components/templates/index/chat/Chat.jsx) | JavaScript JSX | 74 | 3 | 5 | 82 |
| [src/components/templates/index/chat/MainChat.jsx](/src/components/templates/index/chat/MainChat.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [src/components/templates/index/chat/Messages.jsx](/src/components/templates/index/chat/Messages.jsx) | JavaScript JSX | 302 | 27 | 49 | 378 |
| [src/components/templates/index/chat/SendMessage.jsx](/src/components/templates/index/chat/SendMessage.jsx) | JavaScript JSX | 87 | 4 | 11 | 102 |
| [src/components/templates/login/Login.jsx](/src/components/templates/login/Login.jsx) | JavaScript JSX | 104 | -4 | 4 | 104 |
| [src/components/templates/p-admin/challenges/challenge.jsx](/src/components/templates/p-admin/challenges/challenge.jsx) | JavaScript JSX | 9 | 0 | 1 | 10 |
| [src/components/templates/p-admin/news/NewsSection.jsx](/src/components/templates/p-admin/news/NewsSection.jsx) | JavaScript JSX | 135 | 0 | 15 | 150 |
| [src/components/templates/p-user/EditProfile/EditProfile.jsx](/src/components/templates/p-user/EditProfile/EditProfile.jsx) | JavaScript JSX | 26 | -3 | 15 | 38 |
| [src/components/templates/p-user/challenge/ChallengeDoneBox.jsx](/src/components/templates/p-user/challenge/ChallengeDoneBox.jsx) | JavaScript JSX | 5 | 0 | 0 | 5 |
| [src/components/templates/p-user/challenge/ChallengeReq.jsx](/src/components/templates/p-user/challenge/ChallengeReq.jsx) | JavaScript JSX | 31 | 0 | 3 | 34 |
| [src/components/templates/p-user/challenge/ChallengesDone.jsx](/src/components/templates/p-user/challenge/ChallengesDone.jsx) | JavaScript JSX | 7 | -2 | 6 | 11 |
| [src/components/templates/p-user/challenge/Requests.jsx](/src/components/templates/p-user/challenge/Requests.jsx) | JavaScript JSX | 12 | -1 | 0 | 11 |
| [src/components/templates/p-user/index/Challenge.jsx](/src/components/templates/p-user/index/Challenge.jsx) | JavaScript JSX | 36 | 0 | 3 | 39 |
| [src/components/templates/p-user/index/Challenges.jsx](/src/components/templates/p-user/index/Challenges.jsx) | JavaScript JSX | 16 | 0 | 0 | 16 |
| [src/components/templates/p-user/tickets/SendTicket/SendTicket.jsx](/src/components/templates/p-user/tickets/SendTicket/SendTicket.jsx) | JavaScript JSX | 20 | 0 | 5 | 25 |
| [src/components/templates/register-admin/registerAdmin.jsx](/src/components/templates/register-admin/registerAdmin.jsx) | JavaScript JSX | 7 | 0 | 1 | 8 |
| [src/components/templates/register/Register.jsx](/src/components/templates/register/Register.jsx) | JavaScript JSX | 15 | 4 | 0 | 19 |
| [src/components/templates/resetPassword/ResetPassword.jsx](/src/components/templates/resetPassword/ResetPassword.jsx) | JavaScript JSX | 55 | 0 | 8 | 63 |
| [src/hooks/useUser.js](/src/hooks/useUser.js) | JavaScript | -1 | 0 | -4 | -5 |
| [src/utils/auth.js](/src/utils/auth.js) | JavaScript | 0 | 0 | 3 | 3 |
| [src/utils/challengeExpiration.js](/src/utils/challengeExpiration.js) | JavaScript | 51 | 13 | 15 | 79 |
| [src/utils/cleanUpPendingSession.js](/src/utils/cleanUpPendingSession.js) | JavaScript | 39 | 0 | 8 | 47 |
| [src/utils/getAccessToken.js](/src/utils/getAccessToken.js) | JavaScript | 23 | 0 | 2 | 25 |
| [src/utils/pusherClient.js](/src/utils/pusherClient.js) | JavaScript | 49 | 2 | 10 | 61 |
| [src/utils/pusherServer.js](/src/utils/pusherServer.js) | JavaScript | 35 | 2 | 9 | 46 |
| [src/utils/s3.js](/src/utils/s3.js) | JavaScript | 29 | 0 | 7 | 36 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details