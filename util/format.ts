export const formatDate = (date?: Date) =>{
    if(!date) {
        const now = new Date()
        return new Intl.DateTimeFormat('en-US').format(now);
    } else {
        return new Intl.DateTimeFormat('en-US').format(date);
    }
}