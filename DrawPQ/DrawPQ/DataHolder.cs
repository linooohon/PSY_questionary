using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DrawPQ
{
    class DataHolder
    {
        public int length   // property
        {
            get { return data.Count; }
        }

        List<string[]> data = new List<string[]>();
        public DataHolder(string path)
        {
            var reader = new StreamReader(File.OpenRead(path));
            reader.ReadLine();//跳掉第一行
            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine();
                string[] list = line.Split(',');
                data.Add(list);
            }
        }

        public List<float> Draw(string type,int who)
        {
            who--;
            List<float> list = new List<float>();
            int choose;
            int limit;
            switch (type)
            {
                case "D":
                    choose = 4;
                    limit = data[who].Length;
                    while (choose < limit)
                    {
                        list.Add(float.Parse(data[who][choose]));
                        choose += 6;
                    }
                    break;
                case "C":
                    choose = 3;
                    limit = data[who].Length;
                    while (choose < limit)
                    {
                        list.Add(float.Parse(data[who][choose]));
                        choose += 6;
                    }
                    break;
                default:
                    list.Add(0);
                    break;
            }
            return list;
        }

        public List<float> caculate(int start,int delta,int who)
        {
            who--;
            List<float> list = new List<float>();
            int choose = start;
            int limit = data[who].Length;
            while (choose < limit)
            {
                list.Add(float.Parse(data[who][choose]));
                choose += delta;
            }
            return list;
        }

    }
}
