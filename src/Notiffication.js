const Notification = ({ message, type }) => {
    console.log(message, type, typeof type);
    if (message === false) {
        return null;
    }

    return <div className={type}>{message}</div>;
};

export default Notification;
