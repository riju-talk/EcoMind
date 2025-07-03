
-- Create enum types for better data consistency
CREATE TYPE plant_health_status AS ENUM ('Healthy', 'Needs Attention', 'Critical');
CREATE TYPE task_type AS ENUM ('watering', 'fertilizing', 'pesticide', 'pruning', 'repotting', 'checking');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'skipped');
CREATE TYPE sunlight_requirement AS ENUM ('Full Sun', 'Partial Sun', 'Bright, indirect', 'Low light', 'Shade');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plants table
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  sunlight_requirement sunlight_requirement NOT NULL,
  health_status plant_health_status NOT NULL DEFAULT 'Healthy',
  image_url TEXT,
  watering_frequency_days INTEGER NOT NULL DEFAULT 3,
  fertilizing_frequency_days INTEGER DEFAULT 30,
  last_watered_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create care_tasks table for scheduling and tracking plant care
CREATE TABLE public.care_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  task_type task_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  status task_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_chat_sessions table for AI assistant conversations
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_chat_messages table for individual chat messages
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plant_care_logs table for tracking completed care activities
CREATE TABLE public.plant_care_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  task_type task_type NOT NULL,
  notes TEXT,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for plants
CREATE POLICY "Users can view their own plants" ON public.plants
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own plants" ON public.plants
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own plants" ON public.plants
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own plants" ON public.plants
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for care_tasks
CREATE POLICY "Users can view tasks for their plants" ON public.care_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = care_tasks.plant_id 
      AND plants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert tasks for their plants" ON public.care_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = care_tasks.plant_id 
      AND plants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update tasks for their plants" ON public.care_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = care_tasks.plant_id 
      AND plants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete tasks for their plants" ON public.care_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = care_tasks.plant_id 
      AND plants.user_id = auth.uid()
    )
  );

-- Create RLS policies for ai_chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.ai_chat_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions" ON public.ai_chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.ai_chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON public.ai_chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ai_chat_messages
CREATE POLICY "Users can view messages from their sessions" ON public.ai_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions 
      WHERE ai_chat_sessions.id = ai_chat_messages.session_id 
      AND ai_chat_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert messages to their sessions" ON public.ai_chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions 
      WHERE ai_chat_sessions.id = ai_chat_messages.session_id 
      AND ai_chat_sessions.user_id = auth.uid()
    )
  );

-- Create RLS policies for plant_care_logs
CREATE POLICY "Users can view logs for their plants" ON public.plant_care_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = plant_care_logs.plant_id 
      AND plants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert logs for their plants" ON public.plant_care_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plants 
      WHERE plants.id = plant_care_logs.plant_id 
      AND plants.user_id = auth.uid()
    )
  );

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate care tasks based on plant watering schedule
CREATE OR REPLACE FUNCTION public.generate_care_tasks_for_plant(plant_uuid UUID)
RETURNS VOID AS $$
DECLARE
  plant_record RECORD;
  task_date DATE;
  i INTEGER;
BEGIN
  SELECT * INTO plant_record FROM public.plants WHERE id = plant_uuid;
  
  IF plant_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Generate watering tasks for the next 30 days
  FOR i IN 0..29 LOOP
    task_date := CURRENT_DATE + (i * plant_record.watering_frequency_days);
    
    INSERT INTO public.care_tasks (plant_id, task_type, title, scheduled_date)
    VALUES (
      plant_uuid,
      'watering',
      'Water ' || plant_record.name,
      task_date
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Generate monthly fertilizing task if fertilizing_frequency_days is set
  IF plant_record.fertilizing_frequency_days IS NOT NULL THEN
    FOR i IN 0..11 LOOP
      task_date := CURRENT_DATE + (i * plant_record.fertilizing_frequency_days);
      
      INSERT INTO public.care_tasks (plant_id, task_type, title, scheduled_date)
      VALUES (
        plant_uuid,
        'fertilizing',
        'Fertilize ' || plant_record.name,
        task_date
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better query performance
CREATE INDEX idx_plants_user_id ON public.plants(user_id);
CREATE INDEX idx_care_tasks_plant_id ON public.care_tasks(plant_id);
CREATE INDEX idx_care_tasks_scheduled_date ON public.care_tasks(scheduled_date);
CREATE INDEX idx_care_tasks_status ON public.care_tasks(status);
CREATE INDEX idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX idx_plant_care_logs_plant_id ON public.plant_care_logs(plant_id);
