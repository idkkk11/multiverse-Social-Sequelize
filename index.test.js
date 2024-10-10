const { Comment, Like, Post, Profile, User } = require("./index");
const { db } = require('./db/connection.js');

describe('Can create:', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the test suite is run
        await db.sync({ force: true });
    })

    // Write your tests here

    test('User', async () => {
        const testUser = await User.create({ username: 'george1', email: 'george@gmail.com' });
        expect(testUser.username).toBe('george1');
    })

    test('Profile', async () => {
        const testProfile = await Profile.create({ bio: 'happy always', profilePicture: './hatpic.jpg', birthday: '11/11/2011' });
        expect(testProfile.profilePicture).toBe('./hatpic.jpg');
    })

    test('Post', async () => {
        const testPost = await Post.create({ title: "Holiday!", body: "Summer at Home", createdAt: "10/10/2024" });
        expect(testPost.body).toBe('Summer at Home');
    })
    test('Comment', async () => {
        const testComment = await Comment.create({ body: 'Cool!', createdAt: "10/10/2024" });
        expect(testComment.body).toBe('Cool!');
    })
    test('Like', async () => {
        const testLike = await Like.create({ reactionType: 'ThumbsUp', createdAt: "10/10/2024" });
        expect(testLike.reactionType).toBe('ThumbsUp');
    })
})

describe('Can get model:', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the test suite is run
        await db.sync({ force: true });
    })

    test('Profile', async () => {
        await Profile.create({ bio: 'happy always', profilePicture: './hatpic.jpg', birthday: '11/11/2011' });
        const getTestProfile = await Profile.findOne({ where: { bio: 'happy always' } })
        expect(getTestProfile.profilePicture).toBe('./hatpic.jpg');
    })
    test('Comment', async () => {
        await Comment.create({ body: 'Cool!', createdAt: "10/10/2024" });
        const getTestComment = await Comment.findOne({ where: { body: 'Cool!' } })
        expect(getTestComment.createdAt).toBe('10/10/2024');
    })
})

describe('Trying these associations (set and get):', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the test suite is run
        await db.sync({ force: true });
    })

    test('User <> Profile', async () => {
        const newUser = await User.create({ username: 'george1', email: 'george@gmail.com' });
        const profileToAdd = await Profile.create({ bio: 'happy always', profilePicture: './hatpic.jpg', birthday: '11/11/2011' });
        await newUser.setProfile(profileToAdd)
        const userWithProfile = await User.findOne({
            where: { username: "george1" },
            include: Profile,
        });
        expect(userWithProfile.Profile.bio).toBe("happy always")
    })

    test('Post <> Comment', async () => {
        const newPost = await Post.create({ title: "Holiday!", body: "Summer at Home", createdAt: "10/10/2024" });
        const newComments = await Comment.bulkCreate([
            { body: 'Cool!', createdAt: "10/10/2024" },
            { body: 'Nice!', createdAt: "09/10/2024" }
        ]);
        await newPost.addComments(newComments)
        const postWithComments = await Post.findOne({
            where: { title: "Holiday!" },
            include: Comment,
        });
        expect(postWithComments.Comments.length).toBe(2)
    })

})