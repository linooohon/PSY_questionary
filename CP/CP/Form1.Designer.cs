namespace CP
{
    partial class Form1
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.Choose_File = new System.Windows.Forms.Button();
            this.Next_Clip = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.Tabel_Label = new System.Windows.Forms.Label();
            this.Tabel = new System.Windows.Forms.PictureBox();
            this.Last_Clip = new System.Windows.Forms.Button();
            this.Video = new AxWMPLib.AxWindowsMediaPlayer();
            this.Net = new System.Windows.Forms.PictureBox();
            this.ball = new System.Windows.Forms.Label();
            this.outputResult = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.Tabel)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Video)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Net)).BeginInit();
            this.SuspendLayout();
            // 
            // Choose_File
            // 
            this.Choose_File.Location = new System.Drawing.Point(70, 159);
            this.Choose_File.Name = "Choose_File";
            this.Choose_File.Size = new System.Drawing.Size(188, 33);
            this.Choose_File.TabIndex = 0;
            this.Choose_File.Text = "獲取檔案";
            this.Choose_File.UseVisualStyleBackColor = true;
            this.Choose_File.Click += new System.EventHandler(this.Choose_File_Click);
            // 
            // Next_Clip
            // 
            this.Next_Clip.Enabled = false;
            this.Next_Clip.Location = new System.Drawing.Point(70, 382);
            this.Next_Clip.Name = "Next_Clip";
            this.Next_Clip.Size = new System.Drawing.Size(188, 30);
            this.Next_Clip.TabIndex = 2;
            this.Next_Clip.Text = "下一部影片";
            this.Next_Clip.UseVisualStyleBackColor = true;
            this.Next_Clip.Click += new System.EventHandler(this.Next_Clip_Click);
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(0, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(100, 23);
            this.label1.TabIndex = 6;
            // 
            // Tabel_Label
            // 
            this.Tabel_Label.AutoSize = true;
            this.Tabel_Label.Font = new System.Drawing.Font("新細明體", 16F);
            this.Tabel_Label.Location = new System.Drawing.Point(412, 440);
            this.Tabel_Label.Name = "Tabel_Label";
            this.Tabel_Label.Size = new System.Drawing.Size(111, 32);
            this.Tabel_Label.TabIndex = 4;
            this.Tabel_Label.Text = "桌球桌";
            // 
            // Tabel
            // 
            this.Tabel.Enabled = false;
            this.Tabel.Image = global::CP.Properties.Resources.table;
            this.Tabel.InitialImage = null;
            this.Tabel.Location = new System.Drawing.Point(321, 144);
            this.Tabel.Name = "Tabel";
            this.Tabel.Size = new System.Drawing.Size(304, 274);
            this.Tabel.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.Tabel.TabIndex = 5;
            this.Tabel.TabStop = false;
            this.Tabel.WaitOnLoad = true;
            this.Tabel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Tabel_MouseDown);
            // 
            // Last_Clip
            // 
            this.Last_Clip.Enabled = false;
            this.Last_Clip.Location = new System.Drawing.Point(70, 314);
            this.Last_Clip.Name = "Last_Clip";
            this.Last_Clip.Size = new System.Drawing.Size(188, 30);
            this.Last_Clip.TabIndex = 8;
            this.Last_Clip.Text = "上一部影片";
            this.Last_Clip.UseVisualStyleBackColor = true;
            this.Last_Clip.Click += new System.EventHandler(this.Last_Clip_Click);
            // 
            // Video
            // 
            this.Video.Dock = System.Windows.Forms.DockStyle.Right;
            this.Video.Enabled = true;
            this.Video.Location = new System.Drawing.Point(920, 0);
            this.Video.Name = "Video";
            this.Video.OcxState = ((System.Windows.Forms.AxHost.State)(resources.GetObject("Video.OcxState")));
            this.Video.Size = new System.Drawing.Size(400, 712);
            this.Video.TabIndex = 7;
            // 
            // Net
            // 
            this.Net.Image = global::CP.Properties.Resources.net;
            this.Net.Location = new System.Drawing.Point(295, 78);
            this.Net.Name = "Net";
            this.Net.Size = new System.Drawing.Size(353, 64);
            this.Net.TabIndex = 9;
            this.Net.TabStop = false;
            // 
            // ball
            // 
            this.ball.AutoSize = true;
            this.ball.BackColor = System.Drawing.Color.Red;
            this.ball.Location = new System.Drawing.Point(315, 405);
            this.ball.Name = "ball";
            this.ball.Size = new System.Drawing.Size(18, 18);
            this.ball.TabIndex = 10;
            this.ball.Text = "  ";
            this.ball.Visible = false;
            // 
            // outputResult
            // 
            this.outputResult.Enabled = false;
            this.outputResult.Location = new System.Drawing.Point(70, 235);
            this.outputResult.Name = "outputResult";
            this.outputResult.Size = new System.Drawing.Size(188, 33);
            this.outputResult.TabIndex = 11;
            this.outputResult.Text = "導出結果";
            this.outputResult.UseVisualStyleBackColor = true;
            this.outputResult.Click += new System.EventHandler(this.OutputResult_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("新細明體", 32F);
            this.label2.Location = new System.Drawing.Point(73, 553);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(540, 64);
            this.label2.TabIndex = 12;
            this.label2.Text = "桌球落點輔助軟體";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1320, 712);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.outputResult);
            this.Controls.Add(this.ball);
            this.Controls.Add(this.Net);
            this.Controls.Add(this.Last_Clip);
            this.Controls.Add(this.Video);
            this.Controls.Add(this.Tabel);
            this.Controls.Add(this.Tabel_Label);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.Next_Clip);
            this.Controls.Add(this.Choose_File);
            this.Name = "Form1";
            this.Text = "桌球落點輔助軟體";
            ((System.ComponentModel.ISupportInitialize)(this.Tabel)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Video)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Net)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button Choose_File;
        private System.Windows.Forms.Button Next_Clip;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label Tabel_Label;
        private System.Windows.Forms.PictureBox Tabel;
        private System.Windows.Forms.Button Last_Clip;
        private AxWMPLib.AxWindowsMediaPlayer Video;
        private System.Windows.Forms.PictureBox Net;
        private System.Windows.Forms.Label ball;
        private System.Windows.Forms.Button outputResult;
        private System.Windows.Forms.Label label2;
    }
}

