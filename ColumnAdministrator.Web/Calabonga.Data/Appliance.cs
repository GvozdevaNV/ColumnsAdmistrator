using System;

namespace Calabonga.Account.Data {

    public class Appliance {
        public int Id { get; set; }

        public DateTime CreateDate { get; set; }

        public string Price { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool InStock { get; set; }

        public object Attachment { get; set; }
    }
}