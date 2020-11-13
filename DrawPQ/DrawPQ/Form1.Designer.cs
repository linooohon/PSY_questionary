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
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea2 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend2 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            this.comboBox = new System.Windows.Forms.ComboBox();
            this.type = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.getPath = new System.Windows.Forms.Button();
            this.path = new System.Windows.Forms.Label();
            this.Draw = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.chart = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.getValue = new System.Windows.Forms.Button();
            this.StartIndex = new System.Windows.Forms.TextBox();
            this.IndexDelta = new System.Windows.Forms.TextBox();
            this.Denominator = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chart)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // comboBox
            // 
            this.comboBox.FormattingEnabled = true;
            this.comboBox.Items.AddRange(new object[] {
            "C",
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
            chartArea2.Name = "ChartArea1";
            this.chart.ChartAreas.Add(chartArea2);
            legend2.Name = "Legend1";
            this.chart.Legends.Add(legend2);
            this.chart.Location = new System.Drawing.Point(15, 203);
            this.chart.Name = "chart";
            this.chart.Size = new System.Drawing.Size(1049, 338);
            this.chart.TabIndex = 8;
            this.chart.Text = "chart";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.label3);
            this.groupBox2.Controls.Add(this.label2);
            this.groupBox2.Controls.Add(this.Denominator);
            this.groupBox2.Controls.Add(this.IndexDelta);
            this.groupBox2.Controls.Add(this.StartIndex);
            this.groupBox2.Location = new System.Drawing.Point(531, 33);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(343, 147);
            this.groupBox2.TabIndex = 9;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "groupBox2";
            // 
            // getValue
            // 
            this.getValue.Location = new System.Drawing.Point(880, 33);
            this.getValue.Name = "getValue";
            this.getValue.Size = new System.Drawing.Size(184, 147);
            this.getValue.TabIndex = 10;
            this.getValue.Text = "取值";
            this.getValue.UseVisualStyleBackColor = true;
            this.getValue.Click += new System.EventHandler(this.getValue_Click);
            // 
            // StartIndex
            // 
            this.StartIndex.Location = new System.Drawing.Point(121, 35);
            this.StartIndex.Name = "StartIndex";
            this.StartIndex.Size = new System.Drawing.Size(191, 29);
            this.StartIndex.TabIndex = 0;
            // 
            // IndexDelta
            // 
            this.IndexDelta.Location = new System.Drawing.Point(121, 64);
            this.IndexDelta.Name = "IndexDelta";
            this.IndexDelta.Size = new System.Drawing.Size(191, 29);
            this.IndexDelta.TabIndex = 1;
            // 
            // Denominator
            // 
            this.Denominator.Location = new System.Drawing.Point(121, 93);
            this.Denominator.Name = "Denominator";
            this.Denominator.Size = new System.Drawing.Size(191, 29);
            this.Denominator.TabIndex = 2;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(22, 38);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(81, 18);
            this.label2.TabIndex = 3;
            this.label2.Text = "起始index";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(29, 67);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(63, 18);
            this.label3.TabIndex = 4;
            this.label3.Text = "index差";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(37, 96);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(44, 18);
            this.label4.TabIndex = 5;
            this.label4.Text = "分母";
            // 
            // mainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1228, 568);
            this.Controls.Add(this.getValue);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.chart);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.Draw);
            this.Name = "mainForm";
            this.Text = "PQ繪圖";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chart)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
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
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox Denominator;
        private System.Windows.Forms.TextBox IndexDelta;
        private System.Windows.Forms.TextBox StartIndex;
        private System.Windows.Forms.Button getValue;
    }
}

