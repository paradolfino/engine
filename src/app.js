function Game() {
    var self = this;

    self.Debug = (msg) => {
        let args = [...arguments];
        console.log(msg);
    };
    
    self.Validate = (args, utility, source, items) => {
        let valid = true;
        //shared validations
        if (args.length < args.callee.length){
            self.Debug("Incorrect number of arguments for creation of an Object, Room, or Action");
            valid = false;
        }

        if (items != null && items.length) {
            for (let i = 0; i < items.length; i++) {
                if (!source.hasOwnProperty(items[i])){
                    //doesn't exist
                    self.Debug("The "+ utility + ": " + items[i] + " doesn't exist");
                    valid = false;
                }
            }
        }

        return valid;
    }

    self.Source = {
        _utils: {
            CreateObject(name, desc, actions) {
                if (self.Validate(arguments, "Action", self.Source.Actions, actions) == true) {
                    self.Source.Objects[name] = {text: name, desc: desc, actions: actions};
                }
            },
            CreateAction(name, desc, effect) {
                //needs validations
                if (self.Validate(arguments, "Effect", self.Source.Effects, effect) == true) {
                    self.Source.Actions[name] = {text: name,desc: desc, effect: effect};
                }
            },
            CreateRoom(name, desc, objects, nextRooms) {
                if (self.Validate(arguments, "Object", self.Source.Objects, objects) == true) {
                    self.Source.Rooms.push({name: name,desc: desc, objects: objects, nextRooms: nextRooms});
                }
            }
        },
        Objects: {},
        Actions: {},
        Effects: {},
        Rooms: []
    };

    self.State = {
        startRoom: 0,
        hp: 100,
        xp: 0,
        log: [],
        room: null,
        roomObjects: [],
        screen: null
    };

    self.Engine = {
        Start(creation) 
        {
            creation();
            this.LoadRoom();
            self.Debug(self, "Is starting");
            this.LoadScreen();
        },
        LoadRoom(room = self.State.startRoom) 
        {
            let objects;
            self.State.room = self.Source.Rooms[room];
            self.State.roomObjects = [];
            objects = self.State.room.objects;
            self.Debug(objects);
            if (objects != undefined)
            {
                for (let i = 0; i < objects.length; i++) 
                {
                self.State.roomObjects.push(self.Source.Objects[objects]);
                self.Debug(self.State.roomObjects);
                }
            }
            
        },
        LoadScreen()
        {
            let screen = document.getElementById("window");

            if (screen == null) 
            {
                setTimeout(()=>this.LoadScreen(), 100);
            }
            else
            {
                self.State.screen = screen;
                self.Debug("screen loaded");
                this.Log("<p>"
                    + self.State.log.length
                    + ": "
                    + self.State.room.desc
                    + "<br />"+"You see a " 
                    + self.State.roomObjects.join(",") 
                    + " nearby"+"</p>"
                );
                this.LoadControls();
            }
        },
        LoadControls()
        {
            let rooms = self.State.room.nextRooms;
            self.Debug(rooms);
            document.getElementById("up").addEventListener("click", ()=>{
                nextRoom = self.Source.Rooms.findIndex((room)=>room.name == rooms[0]);
                this.LoadRoom(nextRoom);
                this.LoadScreen();
            });
        },
        Log(msg)
        {
            self.State.log.push(msg);
            let log = self.State.log.reverse();
            self.State.screen.innerHTML = "";
            self.State.screen.innerHTML = log.join("");
            self.Debug(self.State.log);
        }
    }
}

var g = new Game();

var template = () => {
    let utils = g.Source._utils;
    utils.CreateAction("Touch", "You touch", null);
    utils.CreateObject("Lamp", "A lamp", ["Touch"]);
    utils.CreateRoom("Lobby", "A hotel lobby stretches before you", ["Lamp"], ["Hallway"]);
    utils.CreateRoom("Hallway", "The long hallway stretches before you", ["Lamp"], [null, "Lobby"]);
};

g.Engine.Start(template);