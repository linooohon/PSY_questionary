using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace DrawPQ
{
    public partial class mainForm : Form
    {
        public mainForm()
        {
            InitializeComponent();
        }

        private void getPath_Click(object sender, EventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.Title = "Select file";
            dialog.InitialDirectory = ".\\";
            dialog.Filter = "csv files (*.csv)|*.csv";
            if (dialog.ShowDialog() == DialogResult.OK)
            {
                path.Text = dialog.FileName;
            }
        }

        private void Draw_Click(object sender, EventArgs e)
        {
            chart.Series.Clear();
            try
            {
                DataHolder dataHolder = new DataHolder(path.Text);
                for (int i = 1; i <= dataHolder.length; i++)
                {
                    var data = dataHolder.Draw(comboBox.Text, i);
                    Series series1 = new Series("第" + i + "條線", 1000);
                    series1.ChartType = SeriesChartType.Line;
                    //將數值新增至序列
                    for (int index = 0; index < data.Count; index++)
                    {
                        series1.Points.AddXY(index, data[index]);
                    }
                    chart.Series.Add(series1);
                }
                chart.Titles.Clear();
                chart.Titles.Add("問卷" + comboBox.Text);
            }
            catch (Exception err){
                MessageBox.Show(err.Message);
            }
        }

        private void getValue_Click(object sender, EventArgs e)
        {
            try
            {
                DataHolder dataHolder = new DataHolder(path.Text);
                for (int i = 1; i <= dataHolder.length; i++)
                {
                    var data = dataHolder.caculate(Int32.Parse(StartIndex.Text), Int32.Parse(IndexDelta.Text),i);
                    float sum = 0;
                    foreach(float item in data)
                    {
                        sum += item;
                    }
                    sum /= Int32.Parse(Denominator.Text);
                    MessageBox.Show(sum.ToString());
                }
            }
            catch (Exception err)
            {
                MessageBox.Show(err.Message);
            }
        }
    }
}
