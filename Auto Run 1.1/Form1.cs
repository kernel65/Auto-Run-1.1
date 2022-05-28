using System;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Runtime.InteropServices;


namespace Auto_Run_1._1
{
    public partial class Form1 : Form
    {
        
        Player player;
        Stream stream;
        public List<int> checkedTemplatesList;
        private Window window;
        private KeyHandler ghkStartBot;
        private KeyHandler ghkStopBot;
        private KeyHandler ghkKeyE;
        private KeyHandler ghkKeyR;

        public Form1()
        {         
            InitializeComponent();
            window = new Window();
            checkedTemplatesList = new List<int>();
            ghkStartBot = new KeyHandler(Keys.F2, this);
            ghkStopBot = new KeyHandler(Keys.F4, this);
            ghkKeyE = new KeyHandler(Keys.E, this);
            ghkKeyR = new KeyHandler(Keys.R, this);
            ghkStartBot.Register();
        }

        private void StartBot_Click(object sender, EventArgs e)
        {
            if (!Player.isRun)
            {
                StartBot();            
            }
            else
            {
                StopBot();
            }                      
        }

        private void StartStream_Click(object sender, EventArgs e)
        {
            if (window.GetWindowHandle(Window.ProgramName) != IntPtr.Zero)
            {
                Stream.isStreamRunning = true;
                if (stream == null)
                {
                    stream = new Stream();
                }

                if (!stream.startStream.IsAlive)
                {
                    stream = new Stream();
                    stream.startStream.Start();
                    ghkKeyE.Register();
                    ghkKeyR.Register();
                    StartStream.Text = "Stop Stream";
                    Console.WriteLine("Stream is started");
                }
                else
                {
                    Stream.isStreamRunning = false;
                    ghkKeyE.Unregiser();
                    ghkKeyR.Unregiser();
                    StartStream.Text = "Start Stream";
                    Console.WriteLine("Stream is stopped");
                }
            }
            else
            {
                Console.WriteLine("New World is not running.Please start the game!");
            }
        }

        private void Form1_KeyPress(object sender, KeyPressEventArgs e)
        {
            
        }

        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {

        }

        private void HandleHotkey(Keys key)
        {

            switch (key)
            {
                case Keys.R:
                    //Регистрация прыжка
                    if (Stream.isStreamRunning)
                    {
                        Stream.IsPressedR = true;
                    }
                    break;
                case Keys.E:
                    if (Stream.isStreamRunning)
                    {
                        Stream.IsPressedE = true;
                    }    
                    break;
                case Keys.F4:
                    if (Player.isRun)
                    {
                        StopBot();
                    }
                    break;
                case Keys.F2:
                    if (!Player.isRun)
                    {
                        StartBot();
                    }
                    break;

            }
        }

        public void SetTemplatesList(List<int> templates)
        {
            templates.Clear();

            for (int i = 0; i < checkedTempates.Items.Count; i++)
            {
                if (checkedTempates.GetItemChecked(i))
                {
                    templates.Add(i);
                }
            }
        }

       
        private void StartBot()
        {
            if(window.GetWindowHandle(Window.ProgramName) != IntPtr.Zero)
            {
                StartBotButton.Text = "StopBot";
                SetTemplatesList(checkedTemplatesList);
                Player.isRun = true;
                player = new Player(checkedTemplatesList);
                player.startBot.Start();
                player.healStream.Start();
                ghkStartBot.Unregiser();
                ghkStopBot.Register();
            }
            else
            {
                Console.WriteLine("New World is not running.Please start the game!");
            }
        }

        private void StopBot()
        {
            if (Player.isRun)
            {
                StartBotButton.Text = "StartBot";
                Console.WriteLine("Bot stopped");
                Player.isRun = false;
                ghkStopBot.Unregiser();
                ghkStartBot.Register();
            }
        }


        private Keys GetKey(IntPtr LParam)
        {
            return (Keys) ((LParam.ToInt32()) >> 16);
        }


        protected override void WndProc(ref Message m)
        {
            if (m.Msg == Constants.WM_HOTKEY_MSG_ID)               
                HandleHotkey(GetKey(m.LParam));
            base.WndProc(ref m);
        }


        [DllImport("user32.dll")]
        static extern int SetWindowText(IntPtr hWnd, string text);

        private void Form1_Load(object sender, EventArgs e)
        {
            AllocConsole();           
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool AllocConsole();

        private void button1_Click(object sender, EventArgs e)
        {
            Window w = new Window();
            GrabImage gi = new GrabImage();

            GrabImage.RECT rect = gi.GetWinCoordinates(Window.ProgramName);
            gi.MakeScreenShot(FileManager.SCREEN, rect, Window.WindowWidth, Window.WindowHeight);

            player.RunHeal();
        }



        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }

        private void checkedTempates_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void folderBrowserDialog1_HelpRequest(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
