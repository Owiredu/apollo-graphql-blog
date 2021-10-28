const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        name: String
        posts: [Post]
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        image: String
        createDate: String
        author: User!
        comments: [Comment]
    }

    type PostResponse {
        status: Int
        message: String!
    }

    type LikeAndUnlikeResponse {
        status: Int
        message: String!
        likesCount: Int!
        unlikesCount: Int!
    }

    input CreatePostContent {
        title: String!
        body: String!
        image: String
        authorId: Int!
        createDate: String!
    }

    input UpdatePostContent {
        id: Int!
        title: String!
        body: String!
        image: String!
        authorId: Int!
    }

    input DeletePostContent {
        id: Int!
    }

    input LikeAndUnlikePostContent {
        id: Int!
    }

    type Comment {
        id: ID!
        body: String!
        user: User!
        post: Post!
    }

    input CreateCommentContent {
        body: String!
        userId: Int!
        postId: Int!
        createDate: String!
    }

    input DeleteCommentContent {
        id: Int!
    }

    type CommentReply {
        id: ID!
        body: String!
        user: User!
        comment: Comment!
    }

    input CommentReplyContent {
        body: String!
        userId: Int!
        commentId: Int!
        createDate: String!
    }

    type Query {
        getUser(email: String!): User
        getPost(title: String!): Post
        getComment(id: ID!): Comment
        getAllUsers: [User]
        getAllPosts: [Post]
        getAllComments: [Comment]
    }

    type Mutation {
        createPost(content: CreatePostContent!): PostResponse!
        updatePost(content: UpdatePostContent!): PostResponse!
        deletePost(content: DeletePostContent!): PostResponse!
        likePost(content: LikeAndUnlikePostContent!): LikeAndUnlikeResponse!
        unlikePost(content: LikeAndUnlikePostContent!): LikeAndUnlikeResponse!
        createComment(content: CreateCommentContent!): PostResponse!
        deleteComment(content: DeleteCommentContent!): PostResponse!
        replyComment(content: CommentReplyContent!): PostResponse!
    }
`;

module.exports = typeDefs;