var app = new Vue({
    el: "#app",
    data: {
        search: "",
        showScan: true,
        respData: "",
        imageV: "",
        constraints: {
            video: {
                facingMode: "environment"
            }
        },
        screenshotTaken: false,
        base64Image: "",
        results:"",
        carFeedback: false,
        feedback:"",
        loadingP: false,
        bcolor: "#96A145",
        scanResult: false,
        plate: "",
        zeros: false,
        showInfo: false,
        manual: true,
        manPlate:"",
        picture: false,
        display: "none",

        
        
    },
    methods: {
        checkcar: function(){
            var secret_key = "sk_478f69251187e4f5991fc73c";
            var url = "https://api.openalpr.com/v3/recognize_bytes?recognize_vehicle=1&country=us&secret_key=" + secret_key;
            var data = this.base64Image //image base 64 string

            fetch(url, {
                method: 'POST',
                body: data,
            }).then((response) => {
                response.json().then((data)=> {
                    // console.log(data);
                    console.log("data length:",data.vehicles);
                    if(data.error == false){
                        if(data.results.length == 0){
                            // console.log("car not found");
                            this.loadingP = false;
                            this.bcolor = "#96A145";
                            this.carFeedback = true;
                            this.picture = false;
                            this.feedback = "Can't find license plate. Try getting closer.";
                        }
                        else if (data.vehicles.length > 1){
                            console.log("Too many cars in the frame");
                            this.loadingP = false;
                            this.bcolor = "#96A145";
                            this.carFeedback = true;
                            this.picture = false;
                            this.feedback = "More than one license plate detected, try again.";
                        }
                        else{
                            this.loadingP = false;
                            this.bcolor = "#96A145";
                            console.log("plate:", data.results[0].plate);
                            this.plate = data.results[0].plate;
                            this.carFeedback = false;
                            this.feedback = "";
                            this.showScan = false;
                            this.picture = false;
                            

                            if(this.plate.includes('0')){
                                this.zeros = true;
                            }
                            else if(this.plate.includes('O')){
                                this.zeros = true;
                            }
                            else{
                                this.zeros = false;
                            }
                            this.scanResult = this.plateAllowedEntry(this.plate);
                        }
                    }
                    else{
                        // console.log("no car found")
                    }
                })
            });

        },
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
        doScreenshot: function(){
            //create canvas for screenshot
            this.bcolor = "#808080";
            this.loadingP = true;
            this.$refs.canvas.width = this.$refs.video.videoWidth;
            this.$refs.canvas.height = this.$refs.video.videoHeight;
            this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0);
            // convert screenshot to base64 image
            // console.log(this.$refs.canvas.toDataURL("image/jpeg").split(';base64,')[1]);
            this.base64Image = this.$refs.canvas.toDataURL("image/jpeg").split(';base64,')[1];
            this.screenshotTaken = true;
            this.picture = true;
            this.display = "flex";
            this.checkcar();
        },
        handleStream: function(stream){
            console.log("in handleStream",this.$refs);
            this.$refs.video.srcObject = stream;
        },

        startStream: async function () {
            const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.handleStream(stream);
        },
        scanAgain: function(){
            this.search = "";
            this.showScan = false;
            this.carFeedback = false;
            this.scanResult = false;
            this.zeros = false;
            this.manual = true;
        },
        showInfoButton: function(){
            if(this.showInfo == true){
                this.showInfo = false;
                this.manual = true;
                this.showScan = false;
            }
            else{
                this.showInfo = true;
                this.manual = false;
                this.showScan = false;
            }
        },
        manualEntry: function(){
            this.manual = true;
        },
        manualAction: function(){
            console.log(this.manPlate);
            this.manPlate = this.manPlate.toUpperCase();
            console.log(this.manPlate);
            this.scanResult = this.plateAllowedEntry(this.manPlate);
            this.manual = false;
            this.plate = this.manPlate;
            this.carFeedback = false;
            this.feedback = "";
            this.showScan = false;
            this.manPlate = "";

        },
        showCamera: function(){
            this.manual = false;
            this.showScan = true;
            this.startStream(this.constraints);
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
        console.log("app is locked and loaded.");
    }
})
