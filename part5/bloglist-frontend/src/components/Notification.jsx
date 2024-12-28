const Notification = ({ notification }) => {
  const { text, error } = notification
  const style = error
    ? {
        color: 'black',
        background: 'indianred',
        boxShadow: '10px 10px 2px -3px grey',
        width: '10%',
        padding: 10,
        marginBottom: 10,
      }
    : {
        color: 'ghostwhite',
        background: 'yellowgreen',
        boxShadow: '10px 10px 2px -3px forestgreen',
        width: '10%',
        padding: 10,
        marginBottom: 10,
      }

  if (!text) {
    return null
  }

  return <div style={style}>{text}</div>
}

export default Notification
