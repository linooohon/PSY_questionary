using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;



namespace CP
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            Origin_ball = new Point(ball.Left, ball.Top);
        }

        videos Clip;
        int whichVideo;
        Point Origin_ball;
        
        private void Choose_File_Click(object sender, EventArgs e)
        {
            try
            {
                Clip = new videos();
                MessageBox.Show((Clip.Count() > 0) ? "成功加載" : "加載為空,請檢查video資料夾後重新加載");
                if (Clip.Count() > 0)
                {
                    whichVideo = 0;
                    Video.URL = Clip.GetNames(whichVideo);
                    ball.Left = Origin_ball.X;
                    ball.Top = Origin_ball.Y;
                    outputResult.Enabled = true;
                    Last_Clip.Enabled = true;
                    Next_Clip.Enabled = true;
                    ball.Visible = true;
                    Tabel.Enabled = true;
                }
            }
            catch (Exception err)
            {
                MessageBox.Show(err.Message);
            }
        }
        private void Next_Clip_Click(object sender, EventArgs e)
        {
            if (whichVideo == Clip.Count() - 1)
                MessageBox.Show("已是最後一部影片");
            else
            {
                Video.URL = Clip.GetNames(++whichVideo);
                ball.Left = Origin_ball.X + Clip.GetPlace(whichVideo)[0];
                ball.Top = Origin_ball.Y - (274 - Clip.GetPlace(whichVideo)[1]) + Tabel.Top;
            }
        }
        private void Last_Clip_Click(object sender, EventArgs e)
        {
            if (whichVideo == 0)
                MessageBox.Show("已是第一部影片");
            else
            {
                Video.URL = Clip.GetNames(--whichVideo);
                ball.Left = Origin_ball.X + Clip.GetPlace(whichVideo)[0];
                ball.Top = Origin_ball.Y - (274 - Clip.GetPlace(whichVideo)[1]) + Tabel.Top;
            }
        }

        private void Tabel_MouseDown(object sender, MouseEventArgs e)
        {
            ball.Left = Origin_ball.X + e.Location.X;
            ball.Top = Origin_ball.Y - (274 - e.Location.Y) + Tabel.Top;
            Clip.SavePlace(whichVideo, e.Location.X, e.Location.Y);
        }

        private void OutputResult_Click(object sender, EventArgs e)
        {
            Clip.BuildFile(false);
            MessageBox.Show("輸出成功");
        }
    }
}
