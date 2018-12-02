function Game() {
    var self = this;

    self.Debug = (msg) => {
        console.log(msg);
    };
    
    self.Validate = (args, utility, source, items) => {
        let valid = true;
        //shared validations
        if (args.length < args.callee.length){
            self.Debug("Incorrect number of arguments for creation of " + utility);
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
        roomObjects: []
    };

    self.Engine = {
        Start(creation) {
            creation();
            this.LoadRoom();
            console.log(self, "Is starting");
        },
        LoadRoom(room = self.State.startRoom) {
            let objects;
            self.State.room = self.Source.Rooms[room];
            objects = self.State.room.objects;
            

            for (let i = 0; i < objects.length; i++) {
                self.State.roomObjects.push(self.Source.Objects[objects[i]]);
            }
            this.Log(self.State.room.desc);
        },
        Log(msg){
        }
    }
}

var g = new Game();

var template = () => {
    let utils = g.Source._utils;
    utils.CreateAction("Touch", "You touch", null);
    utils.CreateObject("Lamp", "A lamp", ["Touch"]);
    utils.CreateRoom("Lobby", "A hotel lobby stretches before you", ["Lamp"], null);
};

g.Engine.Start(template);