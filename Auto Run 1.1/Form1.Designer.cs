
namespace Auto_Run_1._1
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.StartBotButton = new System.Windows.Forms.Button();
            this.StartStream = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.contextMenuStrip2 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.checkedTempates = new System.Windows.Forms.CheckedListBox();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // StartBotButton
            // 
            this.StartBotButton.Location = new System.Drawing.Point(51, 12);
            this.StartBotButton.Name = "StartBotButton";
            this.StartBotButton.Size = new System.Drawing.Size(127, 58);
            this.StartBotButton.TabIndex = 0;
            this.StartBotButton.Text = "StartBot";
            this.StartBotButton.UseVisualStyleBackColor = true;
            this.StartBotButton.Click += new System.EventHandler(this.StartBot_Click);
            // 
            // StartStream
            // 
            this.StartStream.Location = new System.Drawing.Point(272, 12);
            this.StartStream.Name = "StartStream";
            this.StartStream.Size = new System.Drawing.Size(133, 58);
            this.StartStream.TabIndex = 1;
            this.StartStream.Text = "Start Stream";
            this.StartStream.UseVisualStyleBackColor = true;
            this.StartStream.Click += new System.EventHandler(this.StartStream_Click);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(316, 293);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(89, 23);
            this.button1.TabIndex = 2;
            this.button1.Text = "Make Screen";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(61, 4);
            // 
            // contextMenuStrip2
            // 
            this.contextMenuStrip2.Name = "contextMenuStrip2";
            this.contextMenuStrip2.Size = new System.Drawing.Size(61, 4);
            // 
            // checkedTempates
            // 
            this.checkedTempates.FormattingEnabled = true;
            this.checkedTempates.Items.AddRange(new object[] {
            "Blightcrag",
            "Blightroot",
            "Boulder",
            "Bulrush",
            "Bumbleblossom",
            "Bush",
            "Carrots",
            "Dragonglory",
            "Earth Mote",
            "Earthcribe",
            "Earthspine",
            "Flint",
            "Fronded Petalcap",
            "Gold",
            "Hemp",
            "Herbs",
            "Iron Vein",
            "Lifebloom",
            "Lighting Beetle",
            "Lodestone",
            "Mature Tree",
            "Orichalcum Vein",
            "Platinum",
            "Provisions Crate",
            "Rivercress",
            "Seeping Stone",
            "Shockbulb",
            "Silkweed",
            "Silver",
            "Soul Mote",
            "Soulspire",
            "Soulsprout",
            "Soulwyrm",
            "Suncreeper",
            "Supply Crate",
            "Young Tree"});
            this.checkedTempates.Location = new System.Drawing.Point(51, 104);
            this.checkedTempates.Name = "checkedTempates";
            this.checkedTempates.Size = new System.Drawing.Size(354, 130);
            this.checkedTempates.TabIndex = 6;
            this.checkedTempates.SelectedIndexChanged += new System.EventHandler(this.checkedTempates_SelectedIndexChanged);
            // 
            // folderBrowserDialog1
            // 
            this.folderBrowserDialog1.HelpRequest += new System.EventHandler(this.folderBrowserDialog1_HelpRequest);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label1.ImageAlign = System.Drawing.ContentAlignment.BottomLeft;
            this.label1.Location = new System.Drawing.Point(51, 301);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(130, 15);
            this.label1.TabIndex = 7;
            this.label1.Text = "F2 - Start Run/F4 - Stop";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(469, 336);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.checkedTempates);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.StartStream);
            this.Controls.Add(this.StartBotButton);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.Form1_KeyPress);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button StartBotButton;
        private System.Windows.Forms.Button StartStream;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip2;
        public System.Windows.Forms.CheckedListBox checkedTempates;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.Label label1;
    }
}

