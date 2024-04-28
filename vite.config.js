export default {
  server: {
    port: 8181,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
}
