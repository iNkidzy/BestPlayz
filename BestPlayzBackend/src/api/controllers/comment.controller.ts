
/*  EXAMPLE 1 CODE


@Controller('users')
export class UserController {
  constructor(private readonly usersServices: UserServices) {}

//'postUser()' will handle the creating of new User
  @Post('post')
  postUser( @Body() user: CreateUserDto) {
    return this.usersServices.insert(user);
  }
// 'getAll()' returns the list of all the existing users in the database
  @Get()
  getAll() {
    return this.usersServices.getAllUsers();
  }

//'getBooks()' return all the books which are associated with the user
// provided through 'userID' by the request
  @Get('books')
  getBooks( @Body('userID', ParseIntPipe) userID: number ) {
    return this.usersServices.getBooksOfUser(userID);
  }






// EXAMPLE 2

import { Controller, Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './create-course.dto';
@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}
    @Get()
    async getCourses() {
        const courses = await this.coursesService.getCourses();
    }
    @Get(':courseId')
    async getCourse(@Param('courseId') courseId) {
        const course = await this.coursesService.getCourse(courseId);
        return course;
    }
    @Post()
    async addCourse(@Body() createCourseDto: CreateCourseDto) {
        const course = await this.coursesService.addCourse(createCourseDto);
        return course;
    }
    @Delete()
    async deleteCourse(@Query() query) {
        const courses = await this.coursesService.deleteCourse(query.courseId);
        return courses;
    }
}
 */
