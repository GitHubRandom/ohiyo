module.exports = {
    async headers() {
      return [
        {
          source: '/(.*?)',
          headers: [
            {
              key: 'Permissions-Policy',
              value: 'interest-cohort=()',
            }
          ],
        },
      ]
    },
    future: {
      webpack5: true,
    }
  }