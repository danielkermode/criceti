package chat

type Message struct {
	Id   string
	Data string
}

func (self *Message) String() string {
	return self.Id + " says " + self.Data
}
