export default () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  
  console.log("Nitro plugin initialized");
}