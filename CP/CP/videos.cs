using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CP
{
    class videos
    {
        private string[] fileNames;
        private int[] X;
        private int[] Y;
        //取得檔案數目
        public int Count()
        {
            return fileNames.Length;
        }
        //取得所有檔名,存入FileNames
        public videos()
        {
            fileNames = Directory.GetFiles(@"video\", "*.mp4");
            X = new int[fileNames.Length];
            Y = new int[fileNames.Length];
        }
        //取得該序號影片的檔名
        public string GetNames(int input)
        {
            return fileNames[input];
        }

        //把位置x,y輸出成csv檔
        public void BuildFile(bool ifAdd)
        {
            string sbOutput = "";
            for (int i = 0; i < Count(); i++)
            {
                float x = float.Parse(X[i].ToString());
                float y = float.Parse(Y[i].ToString());
                sbOutput += fileNames[i] + "," + (int)( x * 152 / 200)+ "," +(int)((180 - y)* 137 / 180) + "\r\n";
                //sbOutput += fileNames[i] + "," + X[i] + "," + Y[i]+ "\r\n";
            }
            //sbOutput = sbOutput.Remove(sbOutput.Length - 2, 2);
            //MessageBox.Show(sbOutput);
            if (ifAdd)
            {
                // Create and write the csv file
                File.WriteAllText("output.csv", sbOutput);
            }
            else
            {
                // To append more lines to the csv file
                File.AppendAllText("output.csv", sbOutput);
            }
        }

        //存入該序號的位置
        public void SavePlace(int num, int x, int y)
        {
            X[num] = x;
            Y[num] = y;
        }

        public int[] GetPlace(int num)
        {
            int[] reInt = new int[2];
            reInt[0] = X[num];
            reInt[1] = Y[num];
            return reInt;
        }

    }
}
