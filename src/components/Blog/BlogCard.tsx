import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  link: string; // 👈 add this
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  author,
  date,
  readTime,
  category,
  imageUrl,
  link,
}) => {
  return (
    <Link to={link} className="block hover:opacity-90 transition">
      <div className="bg-black text-white rounded-2xl overflow-hidden flex flex-col md:flex-row items-center md:items-start p-6 md:p-10 gap-6 max-w-5xl mx-auto font-sans">
        {/* Left Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-2xl object-cover w-[500px] h-[400px]"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">{title}</h2>
          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center text-xs md:text-sm text-gray-400 flex-wrap gap-x-2">
            <div className="flex items-center mr-2">
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                <span className="text-white text-xs">👤</span>
              </div>
              <span className="font-medium">{author}</span>
            </div>
            <span>• {date}</span>
            <span>• {readTime}</span>
            <span>
              • <span className="text-red-500">{category}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
