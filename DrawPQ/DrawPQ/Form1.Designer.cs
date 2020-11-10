namespace DrawPQ
{
    partial class mainForm
    {
        /// <summary>
        /// 設計工具所需的變數。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清除任何使用中的資源。
        /// </summary>
        /// <param name="disposing">如果應該處置受控資源則為 true，否則為 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 設計工具產生的程式碼

        /// <summary>
        /// 此為設計工具支援所需的方法 - 請勿使用程式碼編輯器修改
        /// 這個方法的內容。
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea1 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend1 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            this.comboBox = new System.Windows.Forms.ComboBox();
            this.type = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.getPath = new System.Windows.Forms.Button();
            this.path = new System.Windows.Forms.Label();
            this.Draw = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.chart = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chart)).BeginInit();
            this.SuspendLayout();
            // 
            // comboBox
            // 
            this.comboBox.FormattingEnabled = true;
            this.comboBox.Items.AddRange(new object[] {
            "D"});
            this.comboBox.Location = new System.Drawing.Point(114, 28);
            this.comboBox.Name = "comboBox";
            this.comboBox.Size = new System.Drawing.Size(121, 26);
            this.comboBox.TabIndex = 0;
            // 
            // type
            // 
            this.type.AutoSize = true;
            this.type.Location = new System.Drawing.Point(28, 32);
            this.type.Name = "type";
            this.type.Size = new System.Drawing.Size(80, 18);
            this.type.TabIndex = 1;
            this.type.Text = "問卷類別";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(28, 88);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(80, 18);
            this.label1.TabIndex = 3;
            this.label1.Text = "問卷地址";
            // 
            // getPath
            // 
            this.getPath.Location = new System.Drawing.Point(112, 68);
            this.getPath.Name = "getPath";
            this.getPath.Size = new System.Drawing.Size(148, 38);
            this.getPath.TabIndex = 4;
            this.getPath.Text = "選擇問卷位置";
            this.getPath.UseVisualStyleBackColor = true;
            this.getPath.Click += new System.EventHandler(this.getPath_Click);
            // 
            // path
            // 
            this.path.AutoSize = true;
            this.path.Location = new System.Drawing.Point(31, 126);
            this.path.Name = "path";
            this.path.Size = new System.Drawing.Size(34, 18);
            this.path.TabIndex = 5;
            this.path.Text = "null";
            // 
            // Draw
            // 
            this.Draw.Location = new System.Drawing.Point(341, 33);
            this.Draw.Name = "Draw";
            this.Draw.Size = new System.Drawing.Size(184, 147);
            this.Draw.TabIndex = 6;
            this.Draw.Text = "畫圖";
            this.Draw.UseVisualStyleBackColor = true;
            this.Draw.Click += new System.EventHandler(this.Draw_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.comboBox);
            this.groupBox1.Controls.Add(this.path);
            this.groupBox1.Controls.Add(this.type);
            this.groupBox1.Controls.Add(this.getPath);
            this.groupBox1.Location = new System.Drawing.Point(15, 22);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(320, 158);
            this.groupBox1.TabIndex = 7;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "選項";
            // 
            // chart
            // 
            chartArea1.Name = "ChartArea1";
            this.chart.ChartAreas.Add(chartArea1);
            legend1.Name = "Legend1";
            this.chart.Legends.Add(legend1);
            this.chart.Location = new System.Drawing.Point(15, 203);
            this.chart.Name = "chart";
            this.chart.Size = new System.Drawing.Size(1049, 338);
            this.chart.TabIndex = 8;
            this.chart.Text = "chart";
            // 
            // mainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1228, 568);
            this.Controls.Add(this.chart);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.Draw);
            this.Name = "mainForm";
            this.Text = "PQ繪圖";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chart)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ComboBox comboBox;
        private System.Windows.Forms.Label type;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button getPath;
        private System.Windows.Forms.Label path;
        private System.Windows.Forms.Button Draw;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.DataVisualization.Charting.Chart chart;
    }
}

