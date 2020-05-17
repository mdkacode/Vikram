module.exports = {
	apps: [
		{
			name: "Backend-code",
			script: "./app.js",
			env: {
				NODE_ENV: "development",
			},
			// eslint-disable-next-line @typescript-eslint/camelcase
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
