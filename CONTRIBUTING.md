# Contributing to Flagship - JS SDK

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Your dev environment must be

node v14.0.0 ++
npm v6.14.4 ++

## Pull Request Process

1. Ensure you're able to do a build.

    ```
    flagship-js-sdk$ npm run build
    ```

2. Ensure you're able to pass unit test.

    ```
    flagship-js-sdk$ npm run test
    ```

3. Consider updating the [README.md](./README.md) with details of changes if needed.

4. Add yourself as a contributor. To add yourself to the table of contributors, follow this command:

    ```
    # Add new contributor <username>, who made a contribution of type <contribution>
    npm run contributors:add -- <username> <contribution>

    # Example:
    npm run contributors:add -- jfmengels code,doc
    ```

    See the [Emoji Key (Contribution Types Reference)](https://allcontributors.org/docs/en/emoji-key) for a list of valid contribution types.

5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.
