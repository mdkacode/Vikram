module.exports = {
	apps: [
		{
			name: "Backend-code",
			script: "./dist/server.js",
			env: {
				NODE_ENV: "production",
			},
			// eslint-disable-next-line @typescript-eslint/camelcase
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
