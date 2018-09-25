import formatErrors from '../formatErrors';
import requireAuth from '../permissions';

export default {
    Mutation: {
        createTeam: requireAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                await models.Team.create({ ...args, owner: user.id });
                return {
                    success: true,
                };
            } catch (err) {
                return {
                    success: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
    },
};
