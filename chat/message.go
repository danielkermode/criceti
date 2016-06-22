package chat

type Message struct {
	Id   string
	Data string
	Type string
}

func (self *Message) String() string {
	return "Id: " + self.Id + " Data: " + self.Data + " Type: " + self.Type
}
