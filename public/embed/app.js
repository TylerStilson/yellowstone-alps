var app = new Vue({
    el: "#app",
    data: {
        search: "",
        plate: "",
        manual: true,
        manPlate:"",
        picture: false,
        display: "none",
        Mselected: false,
        Cselected: false,
        Rselected: false,
        CampSelected: false,
        mgSelected: false,
        Bselected: false,
        Wselected: false,
        anyday: false,
        scanResult: false,
        checks: false,
        result:false,
        month:"",
        date: null,
        day: "",
        year: null,
        daysInMonth: null,
        leftDaysL: [],
        leftDaysN: 0,
        spaces: 0,
        oddColor: 'red',
        difficent: 0,
        months: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        nextMonth: "",
        next2Month:"",
        calc: 0,




        
        
    },
    methods: {
        
        plateEvenOdd: function(plateString) {
            let digits = plateString.match(/\d+/g);
            if (!digits) {
                return 1;
            }
            return parseInt(digits.join('').slice(-1), 10) % 2;
        },
        
        plateAllowedEntry: function(plateString) {
            console.log("in entry function")
            return this.plateEvenOdd(plateString) == moment().date() % 2;
        },
        scanAgain: function(){
            this.search = "";
            this.manual = true;
            this.Mselected = false;
            this.Mselected.checked = false;
            this.result = false;
            this.anyday = false;
        },
        GoToCheck: function(){
            this.checks = true;
            this.manual = false;
        },
        manualAction: function(){
            this.result = true;
            this.checks = false;
            if(this.Mselected == true || this.Cselected == true || this.Rselected == true || this.CampSelected == true || this.mgSelected == true || this.Bselected == true || this.Wselected == true){
                console.log('bool: ',this.Mselected);
                this.manual = false;
                this.anyday = true;
                this.showScan = false;
            }
            else{
                
                console.log(this.manPlate);
                this.manPlate = this.manPlate.toUpperCase();
                console.log(this.manPlate);
                this.scanResult = this.plateAllowedEntry(this.manPlate);
                this.manual = false;
                this.plate = this.manPlate;
                this.manPlate = "";
            }
            

        },
        getCalander: function(){
            let today = moment().format('llll');
            this.day = today.slice(0,3);
            this.date = today.slice(9,11);
            this.year = today.slice(13,17);
            this.month = today.slice(5,8);
            console.log('today', today);
            console.log('day', this.day);
            console.log('date', this.date);
            console.log('year', this.year);
            console.log('month', this.month);

            for(i = 0; i <= this.months.length; i++){
                if(this.month == this.months[i]){
                    this.nextMonth = this.months[i+1];
                    this.next2Month = this.months[i+2];
                }
            }


            if (this.month == "Jan" || this.month == 'Mar' || this.month == 'May' || this.month == 'Jul' || this.month == 'Aug' || this.month == 'Oct' || this.month == 'Dec'){
                this.daysInMonth = 31;
            }
            else if (this.month == 'Apr' || this.month == 'Jun' || this.month == 'Sep' || this.month == 'Nov'){
                this.daysInMonth = 30;
            }
            else if (this.month =='Feb'){
                this.daysInMonth = 28;
            }
            else{
                console.log('error');
            }
            console.log("days in month", this.daysInMonth);

            for(i=1; i<=this.daysInMonth; i++){
                console.log("days",i);
                if (i >= this.date){
                    console.log('helo');
                    // this.leftDaysL.join(i);
                    this.leftDaysN += 1;
                    console.log("days left:", this.leftDaysN);
                }

            }
            console.log(this.leftDaysN);
            
            this.getSpaces(this.day);

            this.difficent = (this.date - 1);
            this.calcDayWeek();
        },
        getSpaces: function(day){
            if(day == "Sun"){
                this.spaces = 0;
            }
            else if(day == "Mon"){
                this.spaces = 1;
            }
            else if(day == "Tue"){
                this.spaces = 2;
            }
            else if(day == "Wed"){
                this.spaces = 3;
            }
            else if(day == "Thu"){
                this.spaces = 4;
            }
            else if(day == "Fri"){
                this.spaces = 5;
            }
            else if(day == "Sat"){
                this.spaces = 6;
            }
            else{
                console.log("error: no day of the week");
            }
        },

        evenDayClass: function (day) {
            console.log("evendayClass:", day);
            let permitted = day % 2 == 0;
            if(this.scanResult == true){
                return {
                    'green-day':!permitted,
                    'red-day': permitted 
                };

            }
            else{
                return {
                    'green-day': permitted,
                    'red-day': !permitted 
                };

            }
            
        },
        calcDayWeek: function(){
            const startOfMonth = moment().startOf('month').add(1, "month").format('dddd');
            console.log("start of next month: ", startOfMonth);
            this.nextMonth = startOfMonth.slice(0,3);

            startOfMonth2 = moment().startOf('month').add(2, "month").format('dddd');
            console.log("start of next month: ", startOfMonth2);
            this.next2Month = startOfMonth2.slice(0,3);

        },
        oddDayClass: function (day) {
            console.log("odddayClass:", day);
            let permitted = day % 2 == 0;
            if(this.scanResult == false){
                return {
                    'green-day':permitted,
                    'red-day': !permitted 
                };

            }
            else{
                return {
                    'green-day': !permitted,
                    'red-day': permitted 
                };

            }
            
        }
        
        
    },
    computed: {
        nextAllowedDate: function() {
            let today = moment().date();
            let tomorrow = moment().add(1, 'days').date();
            if (today % 2 == 1 && tomorrow % 2 == 1) {
              return moment().add(2, 'days').format('dddd, MMMM D');
            } else {
              return "tomorrow, " + moment().add(1, 'days').format('dddd, MMMM D');
            }
          }
    },
    created: function(){
        this.getCalander();
        console.log("app is locked and loaded.");
    }
})
