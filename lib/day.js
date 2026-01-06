export const Day = { 
    WEEK_START: 4, // 3 for Monday, 4 for Sunday

    now: () => {
        const jsdate = new Date();
        const minutes = Math.trunc(Date.now()/60000) - jsdate.getTimezoneOffset();
        return Math.trunc(minutes/1440);
    },

    fromTime: (time) => {
        const currentDate = new Date();
        if (time.year === undefined) time.year = currentDate.getFullYear();
        if (time.month === undefined) time.month = currentDate.getMonth();
        if (time.day === undefined) time.day = currentDate.getDate();

        let days = 0, year = time.year, leap = false;
        while (year != 1970) {
            year--;
            leap = (year%400 == 0) || ((year%4 == 0) && (year%100 != 0));
            days += leap? 366 : 365;
        }
        const daysinmonth = [ 31, leap? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        let month = time.month;
        while (month) { month --; days += daysinmonth[month]; }
        days += time.day;
        return days;
    },

    toTime: (day) => {
        const time = {};
        let days = day, year = 1970, leap;
        time.weekday = (days + Day.WEEK_START)%7;
        while (true) {
            leap = (year%400 == 0) || ((year%4 == 0) && (year%100 != 0));
            const daysinyear = leap? 366 : 365;
            if (days < daysinyear) break;
            days -= daysinyear; year++;
        }
        const daysinmonth = [ 31, leap? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        let month = 0;
        while (true) {
            const d = daysinmonth[month];
            if (days < d) break;
            days -= d; month++;
        }
        time.year = year; time.month = month; time.day = days;
        return time;
    },

    weekDay: (day) => {
        return (day + Day.WEEK_START)%7;
    },

    weekStart: (day) => {
        return day - weekDay(day);
    }
}
