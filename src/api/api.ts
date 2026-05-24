export const API = {
    // AUTHENTICATION
    LOGIN_USERNAME_PASSWORD: "/api/v1/auth/login",
    LOGIN_GOOGLE: "/api/v1/oauth2/google",
    LOGIN_LINKEDIN: "/api/v1/oauth2/linkedin",
    LOGIN_GITHUB: "/api/v1/oauth2/github",
    LOGIN_TWO_FACTOR: "/api/v1/auth/login-two-factor",
    LOGOUT: "/api/v1/auth/logout",
    INTROSPECT: "/api/v1/auth/introspect",

    // USER
    CREATE_USER: "/api/v1/users",
    UPDATE_USER: "/api/v1/users", // + /:id
    DELETE_USER: "/api/v1/users", // + /:id
    GET_USER_BY_ID: "/api/v1/users", // + /:id
    USER_SEARCH: "/api/v1/users/search",
    USER_PROFILE: "/api/v1/users/me",
    USER_STATISTICS: "/api/v1/users/statistics",
    USER_PROFILE_AVATAR: "/api/v1/profiles/update-avatar",
    UPDATE_PROFILE: "/api/v1/profiles",
    UPDATE_PROFILE_BY_ADMIN: "/api/v1/profiles", // + /:userId
    USER_PASSWORD_STATUS: "/api/v1/users/password-status",
    USER_PASSWORD: "/api/v1/users/password",
    USER_CHANGE_PASSWORD: "/api/v1/users/change-password",
    USER_SEND_RESET_PASSWORD: "/api/v1/users/send-link-reset-password",
    USER_RESET_PASSWORD: "/api/v1/users/reset-password",

    // USER SESSION
    GET_USER_SESSIONS: "/api/v1/user-sessions",
    REVOKE_SESSION: "/api/v1/tokens/session", // + /:sessionId

    // TWO FACTOR
    TWO_FACTOR_ACTIVATE: "/api/v1/two-factor/activate",
    TWO_FACTOR_VERIFY_SETUP: "/api/v1/two-factor/verify-code-setup",
    TWO_FACTOR_DISABLE: "/api/v1/two-factor/disable",
    TWO_FACTOR_STATUS: "/api/v1/two-factor/status",

    // SUBSCRIPTION PLANS (Public & Admin)
    SUBSCRIPTION_PLANS: "/api/v1/subscriptions/plans",
    SUBSCRIPTION_ADMIN_PLANS: "/api/v1/subscriptions/admin/plans",
    SUBSCRIPTION_CREATE_PLAN: "/api/v1/subscriptions/admin/plans",
    SUBSCRIPTION_UPDATE_PLAN: "/api/v1/subscriptions/admin/plans",
    SUBSCRIPTION_DELETE_PLAN: "/api/v1/subscriptions/admin/plans", // + /:planId

    // USER SUBSCRIPTIONS
    USER_SUBSCRIPTION_SUBSCRIBE: "/api/v1/user-subscriptions/subscribe",
    USER_SUBSCRIPTION_MY: "/api/v1/user-subscriptions/my-subscription",
    USER_SUBSCRIPTION_CHECK_PREMIUM: "/api/v1/user-subscriptions/check-premium",
    USER_SUBSCRIPTION_RENEW: "/api/v1/user-subscriptions/renew",
    USER_SUBSCRIPTION_CANCEL: "/api/v1/user-subscriptions/cancel",
    USER_SUBSCRIPTION_ADMIN_ASSIGN: "/api/v1/user-subscriptions/admin/assign",
    USER_SUBSCRIPTION_ADMIN_ALL: "/api/v1/user-subscriptions/admin/all",

    // REVIEW
    CREATE_REVIEW: "/api/v1/reviews",
    UPDATE_REVIEW: "/api/v1/reviews",
    DELETE_REVIEW: "/api/v1/reviews", // + /:id
    GET_REVIEWS_BY_COURSE: "/api/v1/reviews/course", // + /:courseId

    // REPORT
    REPORT_STATS: "/api/v1/reports/stats",
    REPORT_OVERVIEW: "/api/v1/reports/overview",
    REPORT_COURSES_OVERVIEW: "/api/v1/reports/courses",

    // PAYMENT
    PAYMENT_CREATE_LINK: "/api/v1/payments/create-link",
    PAYMENT_MY_HISTORY: "/api/v1/payments/my-history",
    PAYMENT_ALL: "/api/v1/payments/all",

    // NOTIFICATION
    GET_NOTIFICATIONS: "/api/v1/notifications",
    GET_UNREAD_NOTIFICATIONS: "/api/v1/notifications/unread",
    NOTIFICATIONS_MARK_READ: "/api/v1/notifications/mark-read",
    NOTIFICATIONS_ADMIN_SEND: "/api/v1/notifications/admin/send",
    NOTIFICATIONS_DELETE: "/api/v1/notifications", // + /:notificationId

    // LESSON NOTE
    CREATE_LESSON_NOTE: "/api/v1/lesson-notes",
    GET_LESSON_NOTE_BY_LESSON: "/api/v1/lesson-notes/lesson", // + /:lessonId
    GET_LESSON_NOTES_BY_COURSE: "/api/v1/lesson-notes/course", // + /:courseId
    UPDATE_LESSON_NOTE: "/api/v1/lesson-notes", // + /:id
    DELETE_LESSON_NOTE: "/api/v1/lesson-notes", // + /:id

    // ENROLLMENT
    ENROLLMENTS_MY_COURSES: "/api/v1/enrollments/my-courses",
    ENROLLMENTS_CHECK: "/api/v1/enrollments/check", // + /:courseId
    ENROLLMENTS_ADMIN: "/api/v1/enrollments/admin/enroll",
    GET_ENROLLMENTS_BY_COURSE: "/api/v1/enrollments/course", // + /:courseId
    UNENROLL_STUDENT: "/api/v1/enrollments", // + /:enrollmentId

    // DOCUMENT
    CREATE_DOCUMENT: "/api/v1/documents",
    GET_DOCUMENT_BY_ID: "/api/v1/documents", // + /:id
    UPDATE_DOCUMENT: "/api/v1/documents", // + /:id
    DELETE_DOCUMENT: "/api/v1/documents", // + /:id
    SEARCH_DOCUMENTS: "/api/v1/documents",

    // COURSE
    CREATE_COURSE: "/api/v1/courses",
    UPDATE_COURSE: "/api/v1/courses", // + /:id
    DELETE_COURSE: "/api/v1/courses", // + /:id
    GET_COURSE_BY_ID: "/api/v1/courses", // + /:id
    GET_COURSE_BY_SLUG: "/api/v1/courses/slug", // + /:slug
    GET_COURSES: "/api/v1/courses",
    GET_LEARNING_DETAILS: "/api/v1/courses", // + /:courseId/learning

    // CHAPTER
    CREATE_CHAPTER: "/api/v1/chapters",
    UPDATE_CHAPTER: "/api/v1/chapters", // + /:id
    DELETE_CHAPTER: "/api/v1/chapters", // + /:id
    SWAP_CHAPTER: "/api/v1/chapters/swap",

    // LESSON
    CREATE_LESSON: "/api/v1/lessons",
    UPDATE_LESSON: "/api/v1/lessons", // + /:id
    DELETE_LESSON: "/api/v1/lessons", // + /:id
    GET_LESSON_BY_ID: "/api/v1/lessons", // + /:id
    GET_LESSONS_BY_CHAPTER: "/api/v1/lessons/chapter", // + /:chapterId
    SWAP_LESSON: "/api/v1/lessons/swap",
    LESSON_PROGRESS: "/api/v1/lesson-progress",

    // FILES
    FILES_PRESIGNED_URL: "/api/v1/files/presigned-url",
    FILES_UPLOAD: "/api/v1/files/upload-video",
    FILES_UPLOAD_SINGLE: "/api/v1/files/upload-single-media",
    FILES_PRE_SIGNED_URL: "/api/v1/files/pre-signed-url",

    // FAVORITES
    FAVORITES_TOGGLE: "/api/v1/favorites/toggle",
    FAVORITES_CHECK: "/api/v1/favorites/check", // + /:targetId?targetType=COURSE|BLOG
    FAVORITES_ME: "/api/v1/favorites/me",

    // COMMENT
    COMMENTS: "/api/v1/comments",
    CREATE_COMMENT: "/api/v1/comments",
    DELETE_COMMENT: "/api/v1/comments", // + /:id
    GET_ROOT_COMMENTS: "/api/v1/comments/root",
    GET_LESSON_ROOT_COMMENTS: "/api/v1/comments/lesson/root",
    GET_COMMENT_REPLIES: "/api/v1/comments/replies",
    GET_COMMENTS_BY_BLOG: "/api/v1/comments/blog", // + /:blogId (Legacy?)
    GET_COMMENTS_BY_LESSON: "/api/v1/comments/lesson", // + /:lessonId (Legacy?)
    GET_REPLIES: "/api/v1/comments", // + /:parentId/replies (Legacy?)

    // BLOG
    CREATE_BLOG: "/api/v1/blogs",
    UPDATE_BLOG: "/api/v1/blogs", // + /:id
    DELETE_BLOG: "/api/v1/blogs", // + /:id
    GET_BLOG_BY_ID: "/api/v1/blogs", // + /:id
    GET_BLOG_BY_SLUG: "/api/v1/blogs/slug", // + /:slug
    GET_BLOGS: "/api/v1/blogs",
    INCREMENT_VIEW: "/api/v1/blogs", // + /:slug/increment-view
    INCREMENT_LIKE: "/api/v1/blogs", // + /:slug/increment-like
    
    // POST (Q&A / forum posts)
    CREATE_POST: "/api/v1/posts",
    GET_POSTS: "/api/v1/posts",
    GET_MY_POSTS: "/api/v1/posts/my-posts",
    GET_POST_BY_SLUG: "/api/v1/posts/slug", // + /:slug
    GET_POST_BY_ID: "/api/v1/posts", // + /:id
    UPDATE_POST: "/api/v1/posts", // + /:id
    DELETE_POST: "/api/v1/posts", // + /:id
    // CATEGORY
    CREATE_CATEGORY: "/api/v1/categories",
    GET_CATEGORIES: "/api/v1/categories",
    DELETE_CATEGORY: "/api/v1/categories", // + /:id
    UPDATE_CATEGORY: "/api/v1/categories", // + /:id

    // TAG
    CREATE_TAG: "/api/v1/tags",
    GET_TAGS: "/api/v1/tags",
    UPDATE_TAG: "/api/v1/tags", // + /:id
    DELETE_TAG: "/api/v1/tags", // + /:id
    CREATE_TAGS_BATCH: "/api/v1/tags/batch",

    // INTERVIEW TOPIC
    CREATE_INTERVIEW_TOPIC: "/api/v1/interview-topics",
    GET_INTERVIEW_TOPICS: "/api/v1/interview-topics",
    GET_INTERVIEW_TOPIC_BY_SLUG: "/api/v1/interview-topics/slug", // + /:slug
    UPDATE_INTERVIEW_TOPIC: "/api/v1/interview-topics", // + /:topicId
    DELETE_INTERVIEW_TOPIC: "/api/v1/interview-topics", // + /:topicId

    // QUESTION SET
    CREATE_QUESTION_SET: "/api/v1/question-sets/topic", // + /:interviewTopicId
    GET_QUESTION_SETS: "/api/v1/question-sets",
    GET_QUESTION_SET_BY_SLUG: "/api/v1/question-sets/slug", // + /:slug
    UPDATE_QUESTION_SET: "/api/v1/question-sets", // + /:questionSetId
    DELETE_QUESTION_SET: "/api/v1/question-sets", // + /:questionSetId

    // INTERVIEW QUESTION
    CREATE_INTERVIEW_QUESTION: "/api/v1/interview-questions/question-set", // + /:questionSetId
    GET_INTERVIEW_QUESTIONS: "/api/v1/interview-questions/question-set", // + /:questionSetId
    GET_INTERVIEW_QUESTIONS_BY_SLUG: "/api/v1/interview-questions/question-set/slug", // + /:questionSetSlug
    UPDATE_INTERVIEW_QUESTION: "/api/v1/interview-questions", // + /:questionId
    DELETE_INTERVIEW_QUESTION: "/api/v1/interview-questions", // + /:questionId

    // QUESTION CONTRIBUTION
    CREATE_QUESTION_CONTRIBUTION: "/api/v1/question-contributions",
    GET_QUESTION_CONTRIBUTIONS: "/api/v1/question-contributions",
    GET_MY_CONTRIBUTIONS: "/api/v1/question-contributions/my-contributions",
    GET_CONTRIBUTION_BY_ID: "/api/v1/question-contributions", // + /:id
    APPROVE_CONTRIBUTION: "/api/v1/question-contributions", // + /:id/approve
    REJECT_CONTRIBUTION: "/api/v1/question-contributions", // + /:id/reject

    // FCM TOKEN
    REGISTER_FCM_TOKEN: "/api/v1/user-fcm-tokens",
    DELETE_FCM_TOKEN: "/api/v1/user-fcm-tokens",

    // CHATBOT
    CHATBOT_CHAT: "/api/v1/chatbot/chat",

    // AI TRAINING
    AI_TRAINING_INGEST_MARKDOWN: "/api/v1/ingestion/markdown",

    // EXERCISES
    CREATE_EXERCISE: "/api/v1/exercises",
    GET_EXERCISES: "/api/v1/exercises",
    GET_EXERCISE_BY_SLUG: "/api/v1/exercises",
    
    // EXERCISE SUBMISSIONS
    START_EXERCISE: "/api/v1/exercise-submission",
    SUBMIT_EXERCISE: "/api/v1/exercise-submission",
    MY_EXERCISES: "/api/v1/exercise-submission/my-exercises",
    MY_STATISTICS: "/api/v1/exercise-submission/my-statistics",
}
